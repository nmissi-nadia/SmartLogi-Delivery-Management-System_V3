import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ColisService, type Colis, type HistoriqueLivraison } from '../../../core/services/colis.service';
import { HistoriqueService } from '../../../core/services/historique.service';
import { DestinataireService } from '../../../core/services/destinataire.service';
import { forkJoin } from 'rxjs';

interface ColisEnrichi extends Colis {
    destinataireNom?: string;
    livreurNom?: string;
}

/**
 * Composant pour afficher les détails d'un colis et son historique
 */
@Component({
    selector: 'app-colis-details',
    standalone: true,
    imports: [CommonModule, RouterLink, NavbarComponent],
    templateUrl: './colis-details.component.html',
    styleUrl: './colis-details.component.css'
})
export class ColisDetailsComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly colisService = inject(ColisService);
    private readonly historiqueService = inject(HistoriqueService);
    private readonly destinataireService = inject(DestinataireService);

    colis = signal<ColisEnrichi | null>(null);
    historique = signal<HistoriqueLivraison[]>([]);
    loading = signal(true);
    errorMessage = signal<string | null>(null);

    ngOnInit(): void {
        const colisId = this.route.snapshot.paramMap.get('id');
        if (colisId) {
            this.chargerDetails(colisId);
        } else {
            this.router.navigate(['/client/mes-colis']);
        }
    }

    private chargerDetails(colisId: string): void {
        this.loading.set(true);
        this.errorMessage.set(null);

        forkJoin({
            colis: this.colisService.getColisById(colisId),
            historique: this.historiqueService.getHistoriqueForColis(colisId)
        }).subscribe({
            next: ({ colis, historique }) => {
                // Enrichir le colis avec le nom du destinataire
                this.destinataireService.getDestinataireById(colis.destinataireId).subscribe({
                    next: (dest) => {
                        this.colis.set({
                            ...colis,
                            destinataireNom: `${dest.prenom} ${dest.nom}`
                        });
                        this.loading.set(false);
                    },
                    error: () => {
                        this.colis.set({
                            ...colis,
                            destinataireNom: `ID: ${colis.destinataireId}`
                        });
                        this.loading.set(false);
                    }
                });

                this.historique.set(historique);
            },
            error: (error) => {
                console.error('Erreur chargement détails:', error);
                this.errorMessage.set('Erreur lors du chargement des détails du colis');
                this.loading.set(false);
            }
        });
    }

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

    getPrioriteClass(priorite: string): string {
        const classes: { [key: string]: string } = {
            'HAUTE': 'priorite-haute',
            'MOYENNE': 'priorite-moyenne',
            'BASSE': 'priorite-basse'
        };
        return classes[priorite] || 'priorite-default';
    }

    retour(): void {
        this.router.navigate(['/client/mes-colis']);
    }
}
