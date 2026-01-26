import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
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
  imports: [CommonModule, FormsModule, NavbarComponent, LivreurFormComponent],
  templateUrl: './livreurs-management.component.html',
  styleUrl: './livreurs-management.component.css'
})
export class LivreursManagementComponent implements OnInit {
  private readonly store = inject(Store<AppState>);

  // Conversion des observables en signals
  livreurs = toSignal(this.store.select(LivreursSelectors.selectAllLivreurs), { initialValue: [] });
  loading = toSignal(this.store.select(LivreursSelectors.selectLivreursLoading), { initialValue: false });
  error = toSignal(this.store.select(LivreursSelectors.selectLivreursError), { initialValue: null });

  // TODO: Implémenter le store users ou charger les utilisateurs via un service
  users = signal<any[]>([]);

  errorMessage = computed(() => this.error());

  // État local pour l'UI
  showModal = signal(false);
  isEditMode = signal(false);
  selectedLivreur = signal<Livreur | null>(null);

  // Données du formulaire
  formData = signal<CreateLivreurDTO>({
    nom: '',
    prenom: '',
    telephone: '',
    vehicule: '',
    zoneId: '',
    userId: ''
  });

  ngOnInit(): void {
    this.store.dispatch(LivreursActions.loadLivreurs());
    // TODO: Charger les utilisateurs quand le store users sera implémenté
  }

  ouvrirModalCreation(): void {
    this.isEditMode.set(false);
    this.selectedLivreur.set(null);
    this.formData.set({
      nom: '',
      prenom: '',
      telephone: '',
      vehicule: '',
      zoneId: '',
      userId: ''
    });
    this.showModal.set(true);
  }

  ouvrirModalModification(livreur: Livreur): void {
    this.isEditMode.set(true);
    this.selectedLivreur.set(livreur);
    this.formData.set({
      nom: livreur.nom,
      prenom: livreur.prenom,
      telephone: livreur.telephone,
      vehicule: livreur.vehicule || '',
      zoneId: livreur.zoneId || '',
      userId: livreur.userId || ''
    });
    this.showModal.set(true);
  }

  fermerModal(): void {
    this.showModal.set(false);
    this.selectedLivreur.set(null);
    this.formData.set({
      nom: '',
      prenom: '',
      telephone: '',
      vehicule: '',
      zoneId: '',
      userId: ''
    });
  }

  soumettre(): void {
    const data = this.formData();
    if (this.isEditMode() && this.selectedLivreur()) {
      this.store.dispatch(LivreursActions.updateLivreur({
        id: this.selectedLivreur()!.id,
        livreur: data as Partial<CreateLivreurDTO>
      }));
    } else {
      this.store.dispatch(LivreursActions.createLivreur({ livreur: data }));
    }
    this.fermerModal();
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

