import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { TokenService } from '../../../core/services/token.service';

/**
 * Composant de callback OAuth2
 * Traite le token JWT retourné par Google/Okta et authentifie l'utilisateur
 */
@Component({
    selector: 'app-oauth2-callback',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './oauth2-callback.component.html',
    styleUrl: './oauth2-callback.component.css'
})
export class OAuth2CallbackComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly authService = inject(AuthService);
    private readonly tokenService = inject(TokenService);

    errorMessage: string | null = null;

    ngOnInit(): void {
        // Extraire le token des paramètres de l'URL
        this.route.queryParams.subscribe(params => {
            const token = params['token'];

            if (token) {
                this.processToken(token);
            } else {
                this.errorMessage = 'Token manquant dans l\'URL';
                console.error('Aucun token trouvé dans les paramètres de l\'URL');

                // Rediriger vers login après 3 secondes
                setTimeout(() => {
                    this.router.navigate(['/auth/login']);
                }, 3000);
            }
        });
    }

    /**
     * Traite le token OAuth2 et authentifie l'utilisateur
     */
    private processToken(token: string): void {
        try {
            // Stocker le token
            this.tokenService.setToken(token);

            // Extraire les informations du token
            const roles = this.tokenService.getRolesFromToken();
            const username = this.tokenService.getUsernameFromToken();

            console.log('OAuth2 Authentication réussie:', { username, roles });

            // Mettre à jour l'état d'authentification
            this.authService['currentUserSubject'].next({
                id: 0,
                username: username || '',
                email: '',
                roles: roles as any[]
            });
            this.authService['isAuthenticatedSubject'].next(true);

            // Rediriger vers le dashboard approprié selon le rôle
            this.authService.redirectByRole();
        } catch (error) {
            console.error('Erreur lors du traitement du token OAuth2:', error);
            this.errorMessage = 'Erreur lors de l\'authentification';

            // Rediriger vers login après 3 secondes
            setTimeout(() => {
                this.router.navigate(['/auth/login']);
            }, 3000);
        }
    }
}
