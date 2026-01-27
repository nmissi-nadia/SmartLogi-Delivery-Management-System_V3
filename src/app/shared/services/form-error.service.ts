import { Injectable } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

/**
 * Service pour centraliser les messages d'erreur des formulaires
 */
@Injectable({
    providedIn: 'root'
})
export class FormErrorService {
    /**
     * Retourne un message d'erreur lisible selon le type d'erreur
     */
    getErrorMessage(errorKey: string, errorValue: any): string {
        const messages: { [key: string]: string } = {
            'required': 'Ce champ est obligatoire.',
            'minlength': `Minimum ${errorValue?.requiredLength} caractères requis.`,
            'maxlength': `Maximum ${errorValue?.requiredLength} caractères autorisés.`,
            'email': 'Format d\'email invalide.',
            'invalidPhone': 'Numéro de téléphone invalide.',
            'invalidPostalCode': 'Le code postal doit comporter 5 chiffres.',
            'pastDate': 'La date doit être dans le futur.',
            'invalidWeight': 'Le poids doit être un nombre.',
            'outOfWeightRange': `Le poids doit être compris entre ${errorValue?.min} et ${errorValue?.max} kg.`
        };

        return messages[errorKey] || 'Champ invalide.';
    }

    /**
     * Récupère le premier message d'erreur d'un ensemble d'erreurs
     */
    getFirstErrorMessage(errors: ValidationErrors | null | undefined): string {
        if (!errors) return '';
        const firstKey = Object.keys(errors)[0];
        return this.getErrorMessage(firstKey, errors[firstKey]);
    }
}
