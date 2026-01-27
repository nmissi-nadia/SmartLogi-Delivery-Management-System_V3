import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../store';
import * as LivreursSelectors from '../../../../store/livreurs/livreurs.selectors';
import * as LivreursActions from '../../../../store/livreurs/livreurs.actions';
import { Livreur } from '../../../../core/services/livreur.service';

import { Observable } from 'rxjs';

/**
 * Formulaire simple pour l'assignation d'un livreur à un colis
 */
@Component({
    selector: 'app-livreur-assignment-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <form [formGroup]="assignmentForm" (ngSubmit)="onSubmit()" class="assignment-form glass-panel">
      <h3 class="form-title">Assigner un Livreur</h3>
      
      <div class="form-group">
        <label for="livreurId">Livreur disponible{{ zoneId ? ' pour cette zone' : '' }}</label>
        <select id="livreurId" formControlName="livreurId" class="form-select">
          <option [value]="null" disabled>Sélectionner un livreur...</option>
          <option *ngFor="let livreur of livreurs$ | async" [value]="livreur.id">
            {{ livreur.nom }} {{ livreur.prenom }} {{ livreur.vehicule ? '(' + livreur.vehicule + ')' : '' }}
          </option>
        </select>
        <div *ngIf="loading$ | async" class="loading-hint">Chargement des livreurs...</div>
        <div *ngIf="(livreurs$ | async)?.length === 0 && !(loading$ | async)" class="error-hint">
          Aucun livreur disponible.
        </div>
      </div>

      <div class="form-actions">
        <button type="button" class="btn-secondary" (click)="onCancel()">Annuler</button>
        <button type="submit" class="btn-primary" [disabled]="assignmentForm.invalid || (loading$ | async)">
          Confirmer l'assignation
        </button>
      </div>
    </form>
  `,
    styles: [`
    .assignment-form {
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      max-width: 500px;
      margin: 0 auto;
    }
    .form-title {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0;
      color: #f8fafc;
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
    .form-select {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 0.5rem;
      padding: 0.75rem 1rem;
      color: white;
      font-size: 1rem;
      cursor: pointer;
    }
    .form-select:focus {
      outline: none;
      border-color: #38bdf8;
      box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.2);
    }
    option {
      background: #1e293b;
      color: white;
    }
    .loading-hint, .error-hint {
      font-size: 0.75rem;
      margin-top: 0.25rem;
    }
    .loading-hint { color: #38bdf8; }
    .error-hint { color: #ef4444; }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }
    .btn-primary {
      background: linear-gradient(to right, #0284c7, #4f46e5);
      color: white;
      border: none;
      padding: 0.625rem 1.5rem;
      font-weight: 600;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-secondary {
      background: rgba(255, 255, 255, 0.05);
      color: #e2e8f0;
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 0.625rem 1.5rem;
      font-weight: 600;
      border-radius: 0.5rem;
      cursor: pointer;
    }
    .glass-panel {
      background: rgba(30, 41, 59, 0.7);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
  `]
})
export class LivreurAssignmentFormComponent implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly store = inject(Store<AppState>);

    @Input() zoneId: string | null = null;
    @Input() initialLivreurId: string | null = null;
    @Output() assign = new EventEmitter<string>();
    @Output() cancel = new EventEmitter<void>();

    assignmentForm!: FormGroup;
    livreurs$!: Observable<Livreur[]>;
    loading$ = this.store.select(LivreursSelectors.selectLivreursLoading);

    ngOnInit(): void {
        this.initForm();
        this.loadLivreurs();
    }

    private initForm(): void {
        this.assignmentForm = this.fb.group({
            livreurId: [this.initialLivreurId, [Validators.required]]
        });
    }

    private loadLivreurs(): void {
        // Dispatch action to ensure livreurs are loaded
        this.store.dispatch(LivreursActions.loadLivreurs());

        // Select based on zone if provided
        if (this.zoneId) {
            this.livreurs$ = this.store.select(LivreursSelectors.selectLivreursByZone(this.zoneId));
        } else {
            this.livreurs$ = this.store.select(LivreursSelectors.selectAllLivreurs);
        }
    }

    onSubmit(): void {
        if (this.assignmentForm.valid) {
            this.assign.emit(this.assignmentForm.value.livreurId);
        }
    }

    onCancel(): void {
        this.cancel.emit();
    }
}
