import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { GestionnaireColisService, type ColisFilters } from '../../../core/services/gestionnaire-colis.service';
import { LivreurService, type Livreur } from '../../../core/services/livreur.service';
import { ZoneService, type Zone } from '../../../core/services/zone.service';
import { debounceTime, Subject } from 'rxjs';

/**
 * Composant pour gérer tous les colis (Gestionnaire)
 */
@Component({
  selector: 'app-colis-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, RouterLink],
  templateUrl: './colis-list.component.html',
  styleUrl: './colis-list.component.css'
})
export class ColisListComponent implements OnInit {
  private readonly colisService = inject(GestionnaireColisService);
  private readonly livreurService = inject(LivreurService);
  private readonly zoneService = inject(ZoneService);

  // Données
  colis = signal<any[]>([]);
  livreurs = signal<Livreur[]>([]);
  zones = signal<Zone[]>([]);

  // Pagination
  currentPage = signal(0);
  pageSize = signal(20);
  totalElements = signal(0);
  totalPages = signal(0);

  // États
  loading = signal(true);
  errorMessage = signal<string | null>(null);

  // Filtres
  filters = signal<ColisFilters>({
    statut: '',
    ville: '',
    priorite: '',
    zoneId: '',
    dateDebut: '',
    dateFin: '',
    page: 0,
    size: 20
  });

  // Recherche
  searchKeyword = signal('');
  private searchSubject = new Subject<string>();

  // Modals
  showAssignModal = signal(false);
  showStatutModal = signal(false);
  showHistoriqueModal = signal(false);
  showStatsModal = signal(false);
  currentColis = signal<any | null>(null);
  historique = signal<any[]>([]);
  stats = signal<any>({});

  // Formulaires
  selectedLivreur = signal('');
  selectedStatut = signal('');
  commentaire = signal('');

  // Options
  statutOptions = ['EN_ATTENTE', 'EN_COURS', 'LIVRE', 'RETOURNE', 'ANNULE'];
  prioriteOptions = ['HAUTE', 'MOYENNE', 'BASSE'];

  ngOnInit(): void {
    this.chargerDonnees();
    this.setupSearch();
  }

  /**
   * Configuration de la recherche avec debounce
   */
  private setupSearch(): void {
    this.searchSubject.pipe(
      debounceTime(300)
    ).subscribe(keyword => {
      if (keyword.trim()) {
        this.rechercherColis(keyword);
      } else {
        this.chargerColis();
      }
    });
  }

  /**
   * Charge toutes les données nécessaires
   */
  private chargerDonnees(): void {
    this.chargerColis();
    this.chargerLivreurs();
    this.chargerZones();
    this.chargerStatistiques();
  }

  /**
   * Charge les colis avec filtres et pagination
   */
  chargerColis(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    const currentFilters = this.filters();
    currentFilters.page = this.currentPage();
    currentFilters.size = this.pageSize();

    this.colisService.getAllColis(currentFilters).subscribe({
      next: (page) => {
        this.colis.set(page.content);
        this.totalElements.set(page.totalElements);
        this.totalPages.set(page.totalPages);
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
   * Recherche des colis par mot-clé
   */
  private rechercherColis(keyword: string): void {
    this.loading.set(true);

    this.colisService.searchColis(keyword, this.currentPage(), this.pageSize()).subscribe({
      next: (page) => {
        this.colis.set(page.content);
        this.totalElements.set(page.totalElements);
        this.totalPages.set(page.totalPages);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Erreur recherche colis:', error);
        this.loading.set(false);
      }
    });
  }

  /**
   * Déclenche la recherche
   */
  onSearchChange(keyword: string): void {
    this.searchKeyword.set(keyword);
    this.searchSubject.next(keyword);
  }

  /**
   * Charge les livreurs
   */
  private chargerLivreurs(): void {
    this.livreurService.getAllLivreurs().subscribe({
      next: (livreurs) => {
        this.livreurs.set(livreurs);
      },
      error: (error) => {
        console.error('Erreur chargement livreurs:', error);
      }
    });
  }

  /**
   * Charge les zones
   */
  private chargerZones(): void {
    this.zoneService.getZones().subscribe({
      next: (zones: Zone[]) => {
        this.zones.set(zones);
      },
      error: (error: any) => {
        console.error('Erreur chargement zones:', error);
      }
    });
  }

  /**
   * Charge les statistiques
   */
  private chargerStatistiques(): void {
    this.colisService.getStatistiquesOverview().subscribe({
      next: (stats) => {
        this.stats.set(stats);
      },
      error: (error) => {
        console.error('Erreur chargement statistiques:', error);
      }
    });
  }

  /**
   * Applique les filtres
   */
  appliquerFiltres(): void {
    this.currentPage.set(0);
    this.chargerColis();
  }

  /**
   * Réinitialise les filtres
   */
  reinitialiserFiltres(): void {
    this.filters.set({
      statut: '',
      ville: '',
      priorite: '',
      zoneId: '',
      dateDebut: '',
      dateFin: '',
      page: 0,
      size: 20
    });
    this.searchKeyword.set('');
    this.currentPage.set(0);
    this.chargerColis();
  }

  /**
   * Change de page
   */
  changerPage(page: number): void {
    this.currentPage.set(page);
    this.chargerColis();
  }

  /**
   * Ouvre le modal d'assignation
   */
  ouvrirModalAssignation(colis: any): void {
    this.currentColis.set(colis);
    this.selectedLivreur.set('');
    this.showAssignModal.set(true);
  }

  /**
   * Assigne un livreur
   */
  assignerLivreur(): void {
    const colis = this.currentColis();
    const livreurId = this.selectedLivreur();

    if (!colis || !livreurId) {
      alert('Veuillez sélectionner un livreur');
      return;
    }

    this.colisService.assignerLivreur(colis.id, livreurId).subscribe({
      next: () => {
        this.chargerColis();
        this.fermerModals();
      },
      error: (error) => {
        console.error('Erreur assignation livreur:', error);
        alert('Erreur lors de l\'assignation du livreur');
      }
    });
  }

  /**
   * Ouvre le modal de modification de statut
   */
  ouvrirModalStatut(colis: any): void {
    this.currentColis.set(colis);
    this.selectedStatut.set(colis.statut || '');
    this.commentaire.set('');
    this.showStatutModal.set(true);
  }

  /**
   * Modifie le statut
   */
  modifierStatut(): void {
    const colis = this.currentColis();
    const statut = this.selectedStatut();

    if (!colis || !statut) {
      alert('Veuillez sélectionner un statut');
      return;
    }

    this.colisService.modifierStatut(colis.id, statut, this.commentaire()).subscribe({
      next: () => {
        this.chargerColis();
        this.fermerModals();
      },
      error: (error) => {
        console.error('Erreur modification statut:', error);
        alert('Erreur lors de la modification du statut');
      }
    });
  }

  /**
   * Ouvre le modal d'historique
   */
  ouvrirModalHistorique(colis: any): void {
    this.currentColis.set(colis);
    this.loading.set(true);

    this.colisService.getHistorique(colis.id).subscribe({
      next: (historique) => {
        this.historique.set(historique);
        this.showHistoriqueModal.set(true);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Erreur chargement historique:', error);
        this.loading.set(false);
      }
    });
  }

  /**
   * Supprime un colis
   */
  supprimerColis(colisId: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce colis ?')) {
      this.colisService.supprimerColis(colisId).subscribe({
        next: () => {
          this.chargerColis();
        },
        error: (error) => {
          console.error('Erreur suppression colis:', error);
          alert('Erreur lors de la suppression du colis');
        }
      });
    }
  }

  /**
   * Ferme tous les modals
   */
  fermerModals(): void {
    this.showAssignModal.set(false);
    this.showStatutModal.set(false);
    this.showHistoriqueModal.set(false);
    this.showStatsModal.set(false);
    this.currentColis.set(null);
  }

  /**
   * Retourne le badge de couleur selon le statut
   */
  getStatutBadgeClass(statut: string): string {
    const classes: { [key: string]: string } = {
      'EN_ATTENTE': 'badge-warning',
      'EN_COURS': 'badge-info',
      'LIVRE': 'badge-success',
      'RETOURNE': 'badge-danger',
      'ANNULE': 'badge-secondary'
    };
    return classes[statut] || 'badge-secondary';
  }

  /**
   * Retourne le badge de couleur selon la priorité
   */
  getPrioriteBadgeClass(priorite: string): string {
    const classes: { [key: string]: string } = {
      'HAUTE': 'badge-danger',
      'MOYENNE': 'badge-warning',
      'BASSE': 'badge-info'
    };
    return classes[priorite] || 'badge-secondary';
  }

  /**
   * Génère le tableau des pages pour la pagination
   */
  get pages(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i);
  }
}
