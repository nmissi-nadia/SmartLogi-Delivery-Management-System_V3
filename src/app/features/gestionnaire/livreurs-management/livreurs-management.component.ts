import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { LivreurService } from '../../../core/services/livreur.service';
import type { Livreur } from '../../../core/services/livreur.service';
import { UserService, type User } from '../../../core/services/user.service';

/**
 * Composant pour gérer les livreurs (Gestionnaire)
 */
@Component({
  selector: 'app-livreurs-management',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './livreurs-management.component.html',
  styleUrl: './livreurs-management.component.css'
})
export class LivreursManagementComponent implements OnInit {
  private readonly livreurService = inject(LivreurService);
  private readonly userService = inject(UserService);

  livreurs = signal<Livreur[]>([]);
  users = signal<User[]>([]);
  loading = signal(true);
  errorMessage = signal<string | null>(null);

  // Modal
  showModal = signal(false);
  isEditMode = signal(false);
  currentLivreur = signal<Livreur | null>(null);

  // Formulaire simplifié
  formData = signal({
    nom: '',
    prenom: '',
    telephone: '',
    vehicule: '',
    zoneId: '',
    userId: ''
  });

  ngOnInit(): void {
    this.chargerLivreurs();
    this.chargerUtilisateurs();
  }

  /**
   * Charge tous les livreurs
   */
  private chargerLivreurs(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.livreurService.getAllLivreurs().subscribe({
      next: (livreurs) => {
        this.livreurs.set(livreurs);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Erreur chargement livreurs:', error);
        this.errorMessage.set('Erreur lors du chargement des livreurs');
        this.loading.set(false);
      }
    });
  }

  /**
   * Charge tous les utilisateurs
   */
  private chargerUtilisateurs(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users.set(users);
      },
      error: (error) => {
        console.error('Erreur chargement utilisateurs:', error);
      }
    });
  }

  /**
   * Ouvre le modal pour créer un livreur
   */
  ouvrirModalCreation(): void {
    this.isEditMode.set(false);
    this.currentLivreur.set(null);
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

  /**
   * Ouvre le modal pour modifier un livreur
   */
  ouvrirModalModification(livreur: Livreur): void {
    this.isEditMode.set(true);
    this.currentLivreur.set(livreur);
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

  /**
   * Ferme le modal
   */
  fermerModal(): void {
    this.showModal.set(false);
    this.currentLivreur.set(null);
  }

  /**
   * Soumet le formulaire
   */
  soumettre(): void {
    const data = this.formData();

    if (!data.nom || !data.prenom || !data.telephone || (!this.isEditMode() && !data.userId)) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (this.isEditMode()) {
      this.modifierLivreur();
    } else {
      this.creerLivreur();
    }
  }

  /**
   * Crée un nouveau livreur
   */
  private creerLivreur(): void {
    const data = this.formData();

    // Format selon LivreurDTO backend
    const payload = {
      nom: data.nom,
      prenom: data.prenom,
      telephone: data.telephone,
      vehicule: data.vehicule || null,
      zoneId: data.zoneId || null,
      userId: data.userId
    };

    console.log('Payload envoyé:', payload);

    this.livreurService.createLivreur(payload as any).subscribe({
      next: () => {
        this.chargerLivreurs();
        this.fermerModal();
      },
      error: (error) => {
        console.error('Erreur création livreur:', error);
        console.error('Détails:', error.error);
        alert(`Erreur lors de la création du livreur: ${error.error?.message || error.message}`);
      }
    });
  }

  /**
   * Modifie un livreur existant
   */
  private modifierLivreur(): void {
    const livreur = this.currentLivreur();
    if (!livreur) return;

    const updatedData = this.formData();

    this.livreurService.updateLivreur(livreur.id, updatedData as any).subscribe({
      next: () => {
        this.chargerLivreurs();
        this.fermerModal();
      },
      error: (error) => {
        console.error('Erreur modification livreur:', error);
        alert('Erreur lors de la modification du livreur');
      }
    });
  }

  /**
   * Supprime un livreur
   */
  supprimerLivreur(livreurId: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce livreur ?')) {
      this.livreurService.deleteLivreur(livreurId).subscribe({
        next: () => {
          this.chargerLivreurs();
        },
        error: (error) => {
          console.error('Erreur suppression livreur:', error);
          alert('Erreur lors de la suppression du livreur');
        }
      });
    }
  }
}
