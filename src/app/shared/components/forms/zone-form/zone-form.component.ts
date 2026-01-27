import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CustomValidators } from '../../../validators/custom-validators';
import { InputErrorComponent } from '../input-error/input-error.component';
import { Zone, CreateZoneDTO } from '../../../../core/services/zone.service';


/**
 * Formulaire pour la création et modification de zone
 */
@Component({
    selector: 'app-zone-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, InputErrorComponent],
    template: `
    <form [formGroup]="zoneForm" (ngSubmit)="onSubmit()" class="zone-form">
      <div class="form-group">
        <label for="nom">Nom de la zone</label>
        <input type="text" id="nom" formControlName="nom" placeholder="ex: Centre-Ville">
        <app-input-error [control]="zoneForm.get('nom')"></app-input-error>
      </div>

      <div class="form-group">
        <label for="codePostal">Code Postal</label>
        <input type="text" id="codePostal" formControlName="codePostal" placeholder="ex: 20000">
        <app-input-error [control]="zoneForm.get('codePostal')"></app-input-error>
      </div>

      <div class="form-actions">
        <button type="button" class="btn-secondary" (click)="onCancel()">Annuler</button>
        <button type="submit" class="btn-primary" [disabled]="zoneForm.invalid">
          {{ initialData ? 'Enregistrer' : 'Créer' }}
        </button>
      </div>
    </form>
  `,
    styles: [`
    .zone-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #94a3b8;
    }
    input {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 0.5rem;
      padding: 0.75rem 1rem;
      color: white;
      font-size: 1rem;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 1rem;
    }
    .btn-primary {
      background: linear-gradient(to right, #0284c7, #4f46e5);
      color: white;
      border: none;
      padding: 0.75rem 2rem;
      font-weight: 600;
      border-radius: 0.5rem;
      cursor: pointer;
    }
    .btn-secondary {
      background: rgba(255, 255, 255, 0.05);
      color: #e2e8f0;
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 0.75rem 2rem;
      font-weight: 600;
      border-radius: 0.5rem;
      cursor: pointer;
    }
  `]
})
export class ZoneFormComponent implements OnInit {
    private readonly fb = inject(FormBuilder);

    @Input() initialData: Zone | null = null;
    @Output() formSubmit = new EventEmitter<CreateZoneDTO>();
    @Output() formCancel = new EventEmitter<void>();

    zoneForm!: FormGroup;

    ngOnInit(): void {
        this.initForm();
        if (this.initialData) {
            this.patchForm(this.initialData);
        }
    }

    private initForm(): void {
        this.zoneForm = this.fb.group({
            nom: ['', [Validators.required]],
            codePostal: ['', [Validators.required, CustomValidators.postalCode]]
        });
    }

    private patchForm(data: Zone): void {
        this.zoneForm.patchValue({
            nom: data.nom,
            codePostal: data.codePostal
        });
    }

    onSubmit(): void {
        if (this.zoneForm.valid) {
            this.formSubmit.emit(this.zoneForm.value);
        }
    }

    onCancel(): void {
        this.formCancel.emit();
    }
}
