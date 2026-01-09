import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColisService, type Colis } from '../../../core/services/colis.service';
import { DestinataireService } from '../../../core/services/destinataire.service';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Interface enrichie
interface ColisEnrichi extends Colis {
    destinataireNom?: string;
}

/**
 * Composant pour afficher l'historique des livraisons
 */
@Component({
    selector: 'app-historique',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './historique.component.html',
    styleUrl: './historique.component.css'
})
export class HistoriqueComponent implements OnInit {
    private readonly colisService = inject(ColisService);
    private readonly destinataireService = inject(DestinataireService);

    historique = signal<ColisEnrichi[]>([]);
    loading = signal(true);
    errorMessage = signal<string | null>(null);

    ngOnInit(): void {
        this.chargerHistorique();
    }

    /**
     * Charge l'historique depuis l'API (colis livrés uniquement)
     */
    private chargerHistorique(): void {
        this.loading.set(true);
        this.errorMessage.set(null);

        // TODO: Récupérer l'ID du client depuis le token JWT
        const clientId = '1';

        this.colisService.getColisByClient(clientId).subscribe({
            next: (colis) => {
                // Filtrer uniquement les colis livrés pour l'historique
                const historique = colis.filter(c => c.statut === 'LIVRE');

                // Enrichir avec les noms des destinataires
                const enrichissements = historique.map(col =>
                    this.destinataireService.getDestinataireById(col.destinataireId).pipe(
                        map(dest => ({
                            ...col,
                            destinataireNom: `${dest.prenom} ${dest.nom}`
                        } as ColisEnrichi)),
                        catchError(() => of({
                            ...col,
                            destinataireNom: `ID: ${col.destinataireId}`
                        } as ColisEnrichi))
                    )
                );

                if (enrichissements.length === 0) {
                    this.historique.set([]);
                    this.loading.set(false);
                    return;
                }

                forkJoin(enrichissements).subscribe({
                    next: (colisEnrichis) => {
                        this.historique.set(colisEnrichis);
                        this.loading.set(false);
                    },
                    error: () => {
                        this.historique.set(historique as ColisEnrichi[]);
                        this.loading.set(false);
                    }
                });
            },
            error: (error) => {
                console.error('Erreur chargement historique:', error);
                this.errorMessage.set('Erreur lors du chargement de l\'historique');
                this.loading.set(false);
            }
        });
    }

    getStatutLabel(statut: string): string {
        const labels: Record<string, string> = {
            'LIVRE': 'Livré',
            'RETOURNE': 'Retourné',
            'ANNULE': 'Annulé'
        };
        return labels[statut] || statut;
    }

    getStatutClass(statut: string): string {
        const classes: Record<string, string> = {
            'LIVRE': 'statut-livre',
            'RETOURNE': 'statut-retourne',
            'ANNULE': 'statut-annule'
        };
        return classes[statut] || '';
    }

    calculerDuree(dateCreation?: Date | string, dateFin?: Date | string): string {
        if (!dateFin || !dateCreation) return '-';

        const diff = new Date(dateFin).getTime() - new Date(dateCreation).getTime();
        const jours = Math.floor(diff / (1000 * 60 * 60 * 24));

        return `${jours} jour${jours > 1 ? 's' : ''}`;
    }

    // Méthodes pour les statistiques
    getCountLivres(): number {
        return this.historique().filter(h => h.statut === 'LIVRE').length;
    }

    getCountRetournes(): number {
        // Compter les colis en transit ou en stock (non encore livrés)
        return this.historique().filter(h => h.statut !== 'LIVRE').length;
    }

    getTotalCount(): number {
        return this.historique().length;
    }
}
