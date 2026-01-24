import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validateurs personnalisés pour l'application SmartLogi
 */
export class CustomValidators {
    /**
     * Valide que la valeur est un numéro de téléphone valide (format simplifié)
     */
    static phoneNumber(control: AbstractControl): ValidationErrors | null {
        if (!control.value) return null;
        const phoneRegex = /^[0-9+ ]{8,15}$/;
        return phoneRegex.test(control.value) ? null : { invalidPhone: true };
    }

    /**
     * Valide que la valeur est un code postal valide (5 chiffres)
     */
    static postalCode(control: AbstractControl): ValidationErrors | null {
        if (!control.value) return null;
        const postalRegex = /^[0-9]{5}$/;
        return postalRegex.test(control.value) ? null : { invalidPostalCode: true };
    }

    /**
     * Valide que la date est dans le futur
     */
    static futureDate(control: AbstractControl): ValidationErrors | null {
        if (!control.value) return null;
        const date = new Date(control.value);
        const now = new Date();
        return date > now ? null : { pastDate: true };
    }

    /**
     * Valide que le poids est compris dans une plage spécifique
     */
    static weightRange(min: number, max: number): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (control.value === null || control.value === undefined || control.value === '') return null;
            const weight = parseFloat(control.value);
            if (isNaN(weight)) return { invalidWeight: true };
            return weight >= min && weight <= max ? null : { outOfWeightRange: { min, max, actual: weight } };
        };
    }
}
