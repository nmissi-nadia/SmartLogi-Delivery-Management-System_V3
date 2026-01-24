import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl } from '@angular/forms';
import { FormErrorService } from '../../../services/form-error.service';

/**
 * Composant pour afficher les messages d'erreur d'un champ de formulaire
 */
@Component({
    selector: 'app-input-error',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div *ngIf="control && control.invalid && (control.dirty || control.touched)" class="error-message">
      {{ errorMessage }}
    </div>
  `,
    styles: [`
    .error-message {
      color: #ef4444;
      font-size: 0.8125rem;
      margin-top: 0.25rem;
      font-family: 'Inter', sans-serif;
      animation: fadeIn 0.2s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class InputErrorComponent {
    @Input() control: AbstractControl | null = null;

    private formErrorService = inject(FormErrorService);

    get errorMessage(): string {
        return this.formErrorService.getFirstErrorMessage(this.control?.errors);
    }
}
