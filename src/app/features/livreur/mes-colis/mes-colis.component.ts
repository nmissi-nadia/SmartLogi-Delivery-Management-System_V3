import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ColisService, type Colis } from '../../../core/services/colis.service';
import { AuthService } from '../../../core/services/auth.service';

/**
 * Composant pour afficher et gérer les colis assignés au livreur
 */
@Component({
  selector: 'app-mes-colis',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  templateUrl: './mes-colis.component.html',
  styleUrl: './mes-colis.component.css'
})
export class MesColisComponent implements OnInit {
  private readonly colisService = inject(ColisService);
  private readonly authService = inject(AuthService);

  // Données
  colis = signal<Colis[]>([]);
  colisFiltres = signal<Colis[]>([]);

  // Filtres
  filtreStatut = signal<string>('');

  // États
  loading = signal(true);
  errorMessage = signal<string | null>(null);

  // Modal de mise à jour de statut
  showStatutModal = signal(false);
  colisSelectionne = signal<Colis | null>(null);
  nouveauStatut = signal<string>('');
  commentaire = signal<string>('');

  // Statistiques
  stats = signal({
    total: 0,
    enTransit: 0,
    livres: 0,
    enAttente: 0
  });

  ngOnInit(): void {
    this.chargerMesColis();
  }

  /**
   * Charge les colis assignés au livreur connecté
   */
  private chargerMesColis(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    // L'endpoint /api/livreurs/colis utilise automatiquement le JWT pour identifier le livreur
    // Pas besoin de passer l'ID du livreur
    this.colisService.getColisByLivreur().subscribe({
      next: (response) => {
        // Le backend retourne une Page, extraire le contenu
        const colis = Array.isArray(response) ? response : (response as any).content || [];
        this.colis.set(colis);
        this.colisFiltres.set(colis);
        this.calculerStatistiques(colis);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Erreur chargement colis:', error);
        this.errorMessage.set('Erreur lors du chargement des colis');
        this.loading.set(false);
      }
    });
  }

  /**
   * Calcule les statistiques des colis
   */
  private calculerStatistiques(colis: Colis[]): void {
    this.stats.set({
      total: colis.length,
      enTransit: colis.filter(c => c.statut === 'EN_TRANSIT').length,
      livres: colis.filter(c => c.statut === 'LIVRE').length,
      enAttente: colis.filter(c => c.statut === 'CREE' || c.statut === 'COLLECTE').length
    });
  }

  /**
   * Applique le filtre de statut
   */
  appliquerFiltre(): void {
    const statut = this.filtreStatut();
    const tousColis = this.colis();

    if (!statut) {
      this.colisFiltres.set(tousColis);
    } else {
      this.colisFiltres.set(tousColis.filter(c => c.statut === statut));
    }
  }

  /**
   * Ouvre le modal de mise à jour de statut
   */
  ouvrirModalStatut(colis: Colis): void {
    this.colisSelectionne.set(colis);
    this.nouveauStatut.set(colis.statut);
    this.commentaire.set('');
    this.showStatutModal.set(true);
  }

  /**
   * Ferme le modal
   */
  fermerModal(): void {
    this.showStatutModal.set(false);
    this.colisSelectionne.set(null);
  }

  /**
   * Met à jour le statut du colis
   */
  mettreAJourStatut(): void {
    const colis = this.colisSelectionne();
    if (!colis) return;

    const statut = this.nouveauStatut();
    const comment = this.commentaire();

    if (!statut) {
      alert('Veuillez sélectionner un statut');
      return;
    }

    this.colisService.updateStatut(colis.id, statut).subscribe({
      next: () => {
        this.chargerMesColis();
        this.fermerModal();
      },
      error: (error) => {
        console.error('Erreur mise à jour statut:', error);
        alert('Erreur lors de la mise à jour du statut');
      }
    });
  }

  /**
   * Retourne la classe CSS pour le badge de statut
   */
  getStatutClass(statut: string): string {
    const classes: { [key: string]: string } = {
      'CREE': 'statut-cree',
      'COLLECTE': 'statut-collecte',
      'EN_STOCK': 'statut-stock',
      'EN_TRANSIT': 'statut-transit',
      'LIVRE': 'statut-livre'
    };
    return classes[statut] || 'statut-default';
  }

  /**
   * Retourne le label du statut
   */
  getStatutLabel(statut: string): string {
    const labels: { [key: string]: string } = {
      'CREE': 'Créé',
      'COLLECTE': 'Collecté',
      'EN_STOCK': 'En stock',
      'EN_TRANSIT': 'En transit',
      'LIVRE': 'Livré'
    };
    return labels[statut] || statut;
  }

  /**
   * Retourne la classe CSS pour le badge de priorité
   */
  getPrioriteClass(priorite: string): string {
    return `priorite-${priorite.toLowerCase()}`;
  }
}
