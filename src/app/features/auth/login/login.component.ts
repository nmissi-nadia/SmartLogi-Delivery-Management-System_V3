import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

/**
 * Composant de connexion
 * Permet aux utilisateurs de s'authentifier avec leur username et password
 */
@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
    private readonly fb = inject(FormBuilder);
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    // Formulaire réactif
    loginForm: FormGroup;

    // Signaux pour gérer l'état
    loading = signal(false);
    errorMessage = signal<string | null>(null);
    showPassword = signal(false);

    constructor() {
        // Initialisation du formulaire avec validation
        this.loginForm = this.fb.group({
            username: ['', [Validators.required, Validators.minLength(3)]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    /**
     * Soumet le formulaire de connexion
     */
    onSubmit(): void {
        // Réinitialiser le message d'erreur
        this.errorMessage.set(null);

        // Vérifier si le formulaire est valide
        if (this.loginForm.invalid) {
            this.markFormGroupTouched(this.loginForm);
            return;
        }

        // Activer le loading
        this.loading.set(true);

        // Récupérer les valeurs du formulaire
        const credentials = this.loginForm.value;

        // Appeler le service d'authentification
        this.authService.login(credentials).subscribe({
            next: (response) => {
                console.log('Connexion réussie:', response);
                this.loading.set(false);

                // Rediriger selon le rôle de l'utilisateur
                this.authService.redirectByRole();
            },
            error: (error) => {
                console.error('Erreur de connexion:', error);
                this.loading.set(false);

                // Afficher le message d'erreur
                this.errorMessage.set(
                    error.message || 'Identifiants incorrects. Veuillez réessayer.'
                );
            }
        });
    }

    /**
     * Bascule la visibilité du mot de passe
     */
    togglePasswordVisibility(): void {
        this.showPassword.update(value => !value);
    }

    /**
     * Marque tous les champs du formulaire comme touchés pour afficher les erreurs
     */
    private markFormGroupTouched(formGroup: FormGroup): void {
        Object.keys(formGroup.controls).forEach(key => {
            const control = formGroup.get(key);
            control?.markAsTouched();
        });
    }

    /**
     * Vérifie si un champ a une erreur et a été touché
     */
    hasError(fieldName: string, errorType: string): boolean {
        const field = this.loginForm.get(fieldName);
        return !!(field?.hasError(errorType) && field?.touched);
    }

    /**
     * Récupère le message d'erreur pour un champ
     */
    getErrorMessage(fieldName: string): string {
        const field = this.loginForm.get(fieldName);

        if (field?.hasError('required')) {
            return 'Ce champ est requis';
        }

        if (field?.hasError('minlength')) {
            const minLength = field.errors?.['minlength'].requiredLength;
            return `Minimum ${minLength} caractères requis`;
        }

        return '';
    }
}
