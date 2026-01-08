import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

/**
 * Composant de navigation avec bouton de déconnexion
 */
@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css'
})
export class NavbarComponent {
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    get currentUser(): User | null {
        return this.authService.getCurrentUser();
    }

    get userRoles(): string[] {
        return this.authService.getUserRoles();
    }

    logout(): void {
        if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
            this.authService.logout();
        }
    }
}
