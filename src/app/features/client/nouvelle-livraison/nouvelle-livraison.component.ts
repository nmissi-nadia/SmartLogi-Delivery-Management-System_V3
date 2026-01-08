import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

/**
 * Composant pour créer une nouvelle demande de livraison
 */
@Component({
    selector: 'app-nouvelle-livraison',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './nouvelle-livraison.component.html',
    styleUrl: './nouvelle-livraison.component.css'
})
export class NouvelleLivraisonComponent {
    private readonly fb = inject(FormBuilder);
    private readonly router = inject(Router);

    livraisonForm: FormGroup;
    loading = signal(false);
    successMessage = signal<string | null>(null);
    errorMessage = signal<string | null>(null);

    constructor() {
        this.livraisonForm = this.fb.group({
            // Informations du destinataire
            nomDestinataire: ['', [Validators.required, Validators.minLength(3)]],
            prenomDestinataire: ['', [Validators.required, Validators.minLength(3)]],
            telephoneDestinataire: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
            adresseDestinataire: ['', [Validators.required, Validators.minLength(10)]],

            // Informations du colis
            description: ['', [Validators.required, Validators.minLength(5)]],
            poids: ['', [Validators.required, Validators.min(0.1)]],
            dimensions: ['', Validators.required],
            valeur: ['', [Validators.min(0)]],

            // Options de livraison
            priorite: ['NORMALE', Validators.required],
            zone: ['', Validators.required],
            instructions: ['']
        });
    }

    onSubmit(): void {
        this.errorMessage.set(null);
        this.successMessage.set(null);

        if (this.livraisonForm.invalid) {
            this.markFormGroupTouched(this.livraisonForm);
            return;
        }

        this.loading.set(true);

        // TODO: Appeler le service API pour créer la livraison
        setTimeout(() => {
            this.loading.set(false);
            this.successMessage.set('Demande de livraison créée avec succès !');
            this.livraisonForm.reset({ priorite: 'NORMALE' });

            // Rediriger vers mes colis après 2 secondes
            setTimeout(() => {
                this.router.navigate(['/client/mes-colis']);
            }, 2000);
        }, 1500);
    }

    private markFormGroupTouched(formGroup: FormGroup): void {
        Object.keys(formGroup.controls).forEach(key => {
            const control = formGroup.get(key);
            control?.markAsTouched();
        });
    }

    hasError(fieldName: string, errorType: string): boolean {
        const field = this.livraisonForm.get(fieldName);
        return !!(field?.hasError(errorType) && field?.touched);
    }

    getErrorMessage(fieldName: string): string {
        const field = this.livraisonForm.get(fieldName);

        if (field?.hasError('required')) return 'Ce champ est requis';
        if (field?.hasError('minlength')) {
            const minLength = field.errors?.['minlength'].requiredLength;
            return `Minimum ${minLength} caractères requis`;
        }
        if (field?.hasError('pattern')) return 'Format invalide (10 chiffres)';
        if (field?.hasError('min')) return 'Valeur minimale non respectée';

        return '';
    }
}
