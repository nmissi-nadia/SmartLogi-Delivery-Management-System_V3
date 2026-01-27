import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CustomValidators } from '../../../validators/custom-validators';
import { FormErrorService } from '../../../services/form-error.service';
import { InputErrorComponent } from '../input-error/input-error.component';
import { Livreur, CreateLivreurDTO } from '../../../../core/services/livreur.service';
import { UserService, User } from '../../../../core/services/user.service';
import { ZoneService, Zone } from '../../../../core/services/zone.service';

import { Observable } from 'rxjs';

/**
 * Formulaire pour la création et modification de livreur
 */
@Component({
    selector: 'app-livreur-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, InputErrorComponent],
    template: `
    <form [formGroup]="livreurForm" (ngSubmit)="onSubmit()" class="livreur-form">
      <div class="grid-container">
        <div class="form-group">
          <label for="nom">Nom</label>
          <input type="text" id="nom" formControlName="nom" placeholder="Nom du livreur">
          <app-input-error [control]="livreurForm.get('nom')"></app-input-error>
        </div>

        <div class="form-group">
          <label for="prenom">Prénom</label>
          <input type="text" id="prenom" formControlName="prenom" placeholder="Prénom du livreur">
          <app-input-error [control]="livreurForm.get('prenom')"></app-input-error>
        </div>

        <div class="form-group">
          <label for="telephone">Téléphone</label>
          <input type="text" id="telephone" formControlName="telephone" placeholder="ex: +212600000000">
          <app-input-error [control]="livreurForm.get('telephone')"></app-input-error>
        </div>

        <div class="form-group">
          <label for="vehicule">Véhicule (Optionnel)</label>
          <input type="text" id="vehicule" formControlName="vehicule" placeholder="ex: Moto, Camionnette">
          <app-input-error [control]="livreurForm.get('vehicule')"></app-input-error>
        </div>

        <div class="form-group">
          <label for="zoneId">Zone d'affectation</label>
          <select id="zoneId" formControlName="zoneId">
            <option [value]="null">Aucune zone</option>
            <option *ngFor="let zone of zones$ | async" [value]="zone.id">
              {{ zone.nom }} ({{ zone.codePostal }})
            </option>
          </select>
        </div>

        <div class="form-group" *ngIf="!initialData">
          <label for="userId">Utilisateur associé</label>
          <select id="userId" formControlName="userId">
            <option [value]="''" disabled>Sélectionner un utilisateur...</option>
            <option *ngFor="let user of users$ | async" [value]="user.id">
              {{ user.username }} ({{ user.email }})
            </option>
          </select>
          <app-input-error [control]="livreurForm.get('userId')"></app-input-error>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" class="btn-secondary" (click)="onCancel()">Annuler</button>
        <button type="submit" class="btn-primary" [disabled]="livreurForm.invalid">
          {{ initialData ? 'Enregistrer' : 'Créer' }}
        </button>
      </div>
    </form>
  `,
    styles: [`
    .livreur-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .grid-container {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.25rem;
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
    input, select {
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
    @media (max-width: 640px) {
      .grid-container {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class LivreurFormComponent implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly userService = inject(UserService);
    private readonly zoneService = inject(ZoneService);

    @Input() initialData: Livreur | null = null;
    @Output() formSubmit = new EventEmitter<CreateLivreurDTO>();
    @Output() formCancel = new EventEmitter<void>();

    livreurForm!: FormGroup;
    users$: Observable<User[]> = this.userService.getAllUsers();
    zones$: Observable<Zone[]> = this.zoneService.getZones();

    ngOnInit(): void {
        this.initForm();
        if (this.initialData) {
            this.patchForm(this.initialData);
        }
    }

    private initForm(): void {
        this.livreurForm = this.fb.group({
            nom: ['', [Validators.required]],
            prenom: ['', [Validators.required]],
            telephone: ['', [Validators.required, CustomValidators.phoneNumber]],
            vehicule: [''],
            zoneId: [null],
            userId: ['', !this.initialData ? [Validators.required] : []]
        });
    }

    private patchForm(data: Livreur): void {
        this.livreurForm.patchValue({
            nom: data.nom,
            prenom: data.prenom,
            telephone: data.telephone,
            vehicule: data.vehicule || '',
            zoneId: data.zoneId || null,
            userId: data.userId || ''
        });
    }

    onSubmit(): void {
        if (this.livreurForm.valid) {
            this.formSubmit.emit(this.livreurForm.value);
        }
    }

    onCancel(): void {
        this.formCancel.emit();
    }
}
