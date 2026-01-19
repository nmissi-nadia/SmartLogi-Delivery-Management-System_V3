import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ColisService, type Colis } from '../../../core/services/colis.service';
import { AuthService } from '../../../core/services/auth.service';

/**
 * Composant pour gérer la tournée quotidienne du livreur
 */
@Component({
  selector: 'app-tournee',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  templateUrl: './tournee.component.html',
  styleUrl: './tournee.component.css'
})
export class TourneeComponent implements OnInit {
  private readonly colisService = inject(ColisService);
  private readonly authService = inject(AuthService);

  // Données
  colisJour = signal<Colis[]>([]);
  colisGroupesParZone = signal<{ [zone: string]: Colis[] }>({});

  // États
  loading = signal(true);
  errorMessage = signal<string | null>(null);

  // Statistiques de la tournée
  stats = signal({
    total: 0,
    livres: 0,
    enCours: 0,
    restant: 0,
    distanceEstimee: 0,
    tempsEstime: 0
  });

  // Modal de confirmation de livraison
  showLivraisonModal = signal(false);
  colisSelectionne = signal<Colis | null>(null);
  commentaireLivraison = signal<string>('');
  livraisonReussie = signal(true);

  ngOnInit(): void {
    this.chargerTournee();
  }

  /**
   * Charge les colis de la tournée du jour
   */
  private chargerTournee(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    // L'endpoint /api/livreurs/colis utilise automatiquement le JWT
    this.colisService.getColisByLivreur().subscribe({
      next: (response) => {
        // Le backend retourne une Page, extraire le contenu
        const allColis = Array.isArray(response) ? response : (response as any).content || [];

        // Filtrer uniquement les colis de la journée (EN_TRANSIT et COLLECTE)
        const colisActifs = allColis.filter((c: Colis) =>
          c.statut === 'EN_TRANSIT' || c.statut === 'COLLECTE'
        );

        this.colisJour.set(colisActifs);
        this.grouperParZone(colisActifs);
        this.calculerStatistiques(colisActifs);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Erreur chargement tournée:', error);
        this.errorMessage.set('Erreur lors du chargement de la tournée');
        this.loading.set(false);
      }
    });
  }

  /**
   * Groupe les colis par zone
   */
  private grouperParZone(colis: Colis[]): void {
    const groupes: { [zone: string]: Colis[] } = {};

    colis.forEach(c => {
      const zone = c.villeDestination || 'Non définie';
      if (!groupes[zone]) {
        groupes[zone] = [];
      }
      groupes[zone].push(c);
    });

    this.colisGroupesParZone.set(groupes);
  }

  /**
   * Calcule les statistiques de la tournée
   */
  private calculerStatistiques(colis: Colis[]): void {
    const livres = colis.filter(c => c.statut === 'LIVRE').length;
    const enCours = colis.filter(c => c.statut === 'EN_TRANSIT').length;

    // Estimation simple: 15 min par colis + 5 km par colis
    const tempsEstime = colis.length * 15;
    const distanceEstimee = colis.length * 5;

    this.stats.set({
      total: colis.length,
      livres: livres,
      enCours: enCours,
      restant: colis.length - livres,
      distanceEstimee: distanceEstimee,
      tempsEstime: tempsEstime
    });
  }

  /**
   * Ouvre le modal de confirmation de livraison
   */
  ouvrirModalLivraison(colis: Colis): void {
    this.colisSelectionne.set(colis);
    this.commentaireLivraison.set('');
    this.livraisonReussie.set(true);
    this.showLivraisonModal.set(true);
  }

  /**
   * Ferme le modal
   */
  fermerModal(): void {
    this.showLivraisonModal.set(false);
    this.colisSelectionne.set(null);
  }

  /**
   * Confirme la livraison
   */
  confirmerLivraison(): void {
    const colis = this.colisSelectionne();
    if (!colis) return;

    const statut = this.livraisonReussie() ? 'LIVRE' : 'EN_TRANSIT';
    const commentaire = this.commentaireLivraison();

    this.colisService.updateStatut(colis.id, statut).subscribe({
      next: () => {
        this.chargerTournee();
        this.fermerModal();
      },
      error: (error) => {
        console.error('Erreur confirmation livraison:', error);
        alert('Erreur lors de la confirmation de la livraison');
      }
    });
  }

  /**
   * Démarre la tournée
   */
  demarrerTournee(): void {
    const colis = this.colisJour();
    if (colis.length === 0) {
      alert('Aucun colis à livrer aujourd\'hui');
      return;
    }

    // Mettre tous les colis en transit
    const promises = colis
      .filter(c => c.statut === 'COLLECTE')
      .map(c => this.colisService.updateStatut(c.id, 'EN_TRANSIT').toPromise());

    Promise.all(promises).then(() => {
      this.chargerTournee();
      alert('Tournée démarrée !');
    }).catch(error => {
      console.error('Erreur démarrage tournée:', error);
      alert('Erreur lors du démarrage de la tournée');
    });
  }

  /**
   * Retourne les zones triées
   */
  getZones(): string[] {
    return Object.keys(this.colisGroupesParZone()).sort();
  }

  /**
   * Retourne la classe CSS pour le badge de statut
   */
  getStatutClass(statut: string): string {
    const classes: { [key: string]: string } = {
      'COLLECTE': 'statut-collecte',
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
      'COLLECTE': 'À collecter',
      'EN_TRANSIT': 'En transit',
      'LIVRE': 'Livré'
    };
    return labels[statut] || statut;
  }

  /**
   * Calcule le pourcentage de progression
   */
  getProgression(): number {
    const stats = this.stats();
    if (stats.total === 0) return 0;
    return Math.round((stats.livres / stats.total) * 100);
  }
}
