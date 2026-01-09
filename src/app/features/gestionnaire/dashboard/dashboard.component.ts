import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { StatistiquesService, type StatistiquesOverview } from '../../../core/services/statistiques.service';
import { GestionnaireService } from '../../../core/services/gestionnaire.service';
import type { Colis } from '../../../core/services/colis.service';

/**
 * Composant Dashboard pour le gestionnaire logistique
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private readonly statistiquesService = inject(StatistiquesService);
  private readonly gestionnaireService = inject(GestionnaireService);

  statistiques = signal<StatistiquesOverview | null>(null);
  colisRecents = signal<Colis[]>([]);
  loading = signal(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.chargerDonnees();
  }

  private chargerDonnees(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    // Charger les statistiques
    this.statistiquesService.getStatistiquesOverview().subscribe({
      next: (stats) => {
        this.statistiques.set(stats);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Erreur chargement statistiques:', error);
        this.errorMessage.set('Erreur lors du chargement des statistiques');
        this.loading.set(false);
      }
    });

    // Charger les colis récents via GestionnaireService
    this.gestionnaireService.getAllColis().subscribe({
      next: (colis) => {
        // Prendre les 5 derniers colis
        this.colisRecents.set(colis.slice(0, 5));
      },
      error: (error) => {
        console.error('Erreur chargement colis récents:', error);
      }
    });
  }

  /**
   * Calcule le taux de livraison
   */
  getTauxLivraison(): number {
    const stats = this.statistiques();
    if (!stats || stats.totalColis === 0) return 0;
    return Math.round((stats.colisLivres / stats.totalColis) * 100);
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
}
