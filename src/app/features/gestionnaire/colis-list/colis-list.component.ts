import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { GestionnaireService } from '../../../core/services/gestionnaire.service';
import type { Colis } from '../../../core/services/colis.service';

/**
 * Composant pour gérer tous les colis (Gestionnaire)
 */
@Component({
  selector: 'app-colis-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NavbarComponent],
  templateUrl: './colis-list.component.html',
  styleUrl: './colis-list.component.css'
})
export class ColisListComponent implements OnInit {
  private readonly gestionnaireService = inject(GestionnaireService);

  colis = signal<Colis[]>([]);
  colisFiltres = signal<Colis[]>([]);
  loading = signal(true);
  errorMessage = signal<string | null>(null);

  // Filtres
  filtreStatut = signal<string>('');
  filtrePriorite = signal<string>('');
  filtreVille = signal<string>('');
  recherche = signal<string>('');

  // Pagination
  page = signal(0);
  pageSize = signal(10);
  totalPages = signal(0);

  ngOnInit(): void {
    this.chargerColis();
  }

  /**
   * Charge tous les colis
   */
  private chargerColis(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.gestionnaireService.getAllColis().subscribe({
      next: (colis) => {
        this.colis.set(colis);
        this.appliquerFiltres();
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
   * Applique les filtres
   */
  appliquerFiltres(): void {
    let resultats = [...this.colis()];

    // Filtre par statut
    if (this.filtreStatut()) {
      resultats = resultats.filter(c => c.statut === this.filtreStatut());
    }

    // Filtre par priorité
    if (this.filtrePriorite()) {
      resultats = resultats.filter(c => c.priorite === this.filtrePriorite());
    }

    // Filtre par ville
    if (this.filtreVille()) {
      resultats = resultats.filter(c =>
        c.villeDestination.toLowerCase().includes(this.filtreVille().toLowerCase())
      );
    }

    // Recherche
    if (this.recherche()) {
      const terme = this.recherche().toLowerCase();
      resultats = resultats.filter(c =>
        c.id.toLowerCase().includes(terme) ||
        c.description.toLowerCase().includes(terme) ||
        c.villeDestination.toLowerCase().includes(terme)
      );
    }

    this.colisFiltres.set(resultats);
    this.totalPages.set(Math.ceil(resultats.length / this.pageSize()));
  }

  /**
   * Réinitialise les filtres
   */
  reinitialiserFiltres(): void {
    this.filtreStatut.set('');
    this.filtrePriorite.set('');
    this.filtreVille.set('');
    this.recherche.set('');
    this.appliquerFiltres();
  }

  /**
   * Retourne les colis de la page actuelle
   */
  get colisPagines(): Colis[] {
    const debut = this.page() * this.pageSize();
    const fin = debut + this.pageSize();
    return this.colisFiltres().slice(debut, fin);
  }

  /**
   * Change de page
   */
  changerPage(nouvellePage: number): void {
    if (nouvellePage >= 0 && nouvellePage < this.totalPages()) {
      this.page.set(nouvellePage);
    }
  }

  /**
   * Supprime un colis
   */
  supprimerColis(colisId: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce colis ?')) {
      // TODO: Implémenter la suppression via le service
      console.log('Suppression du colis:', colisId);
    }
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
    const classes: { [key: string]: string } = {
      'HAUTE': 'priorite-haute',
      'MOYENNE': 'priorite-moyenne',
      'BASSE': 'priorite-basse'
    };
    return classes[priorite] || 'priorite-default';
  }
}
