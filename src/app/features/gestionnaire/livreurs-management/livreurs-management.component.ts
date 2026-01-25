import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { LivreurFormComponent } from '../../../shared/components/forms/livreur-form/livreur-form.component';
import { Livreur, CreateLivreurDTO } from '../../../core/services/livreur.service';
import { AppState } from '../../../store';
import * as LivreursActions from '../../../store/livreurs/livreurs.actions';
import * as LivreursSelectors from '../../../store/livreurs/livreurs.selectors';

/**
 * Composant pour gérer les livreurs (Gestionnaire)
 * Utilisé pour lister, créer, modifier et supprimer des livreurs via NgRx
 */
@Component({
  selector: 'app-livreurs-management',
  standalone: true,
  imports: [CommonModule, NavbarComponent, LivreurFormComponent],
  templateUrl: './livreurs-management.component.html',
  styleUrl: './livreurs-management.component.css'
})
export class LivreursManagementComponent implements OnInit {
  private readonly store = inject(Store<AppState>);

  // Sélecteurs NgRx
  livreurs$ = this.store.select(LivreursSelectors.selectAllLivreurs);
  loading$ = this.store.select(LivreursSelectors.selectLivreursLoading);
  error$ = this.store.select(LivreursSelectors.selectLivreursError);

  // État local pour l'UI
  showModal = signal(false);
  isEditMode = signal(false);
  selectedLivreur = signal<Livreur | null>(null);

  ngOnInit(): void {
    this.store.dispatch(LivreursActions.loadLivreurs());
  }

  ouvrirModalCreation(): void {
    this.isEditMode.set(false);
    this.selectedLivreur.set(null);
    this.showModal.set(true);
  }

  ouvrirModalModification(livreur: Livreur): void {
    this.isEditMode.set(true);
    this.selectedLivreur.set(livreur);
    this.showModal.set(true);
  }

  fermerModal(): void {
    this.showModal.set(false);
    this.selectedLivreur.set(null);
  }

  onFormSubmit(data: CreateLivreurDTO): void {
    if (this.isEditMode() && this.selectedLivreur()) {
      this.store.dispatch(LivreursActions.updateLivreur({
        id: this.selectedLivreur()!.id,
        livreur: data as Partial<CreateLivreurDTO>
      }));
    } else {
      this.store.dispatch(LivreursActions.createLivreur({ livreur: data }));
    }
    // Note: Dans un cas réel, on attendrait le succès du store pour fermer le modal
    // Pour simplifier, on ferme ici ou via un effect qui écoute le succès
    this.fermerModal();
  }

  supprimerLivreur(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce livreur ?')) {
      this.store.dispatch(LivreursActions.deleteLivreur({ id }));
    }
  }
}

