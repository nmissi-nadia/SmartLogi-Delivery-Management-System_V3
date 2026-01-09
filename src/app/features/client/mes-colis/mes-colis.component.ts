import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ColisService, type Colis } from '../../../core/services/colis.service';
import { DestinataireService } from '../../../core/services/destinataire.service';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Interface enrichie avec les détails
interface ColisEnrichi extends Colis {
    destinataireNom?: string;
    livreurNom?: string;
}

/**
 * Composant pour afficher la liste des colis du client
 */
@Component({
    selector: 'app-mes-colis',
    standalone: true,
    imports: [CommonModule, RouterLink, NavbarComponent],
    templateUrl: './mes-colis.component.html',
    styleUrl: './mes-colis.component.css'
})
export class MesColisComponent implements OnInit {
    private readonly colisService = inject(ColisService);
    private readonly destinataireService = inject(DestinataireService);

    colis = signal<ColisEnrichi[]>([]);
    filtreStatut = signal<string>('tous');
    loading = signal(true);
    errorMessage = signal<string | null>(null);

    ngOnInit(): void {
        this.chargerColis();
    }

    /**
     * Charge les colis depuis l'API et enrichit avec les détails
     */
    private chargerColis(): void {
        this.loading.set(true);
        this.errorMessage.set(null);

        // TODO: Récupérer l'ID du client depuis le token JWT
        const clientId = '1';

        this.colisService.getColisByClient(clientId).subscribe({
            next: (colis) => {
                // Enrichir chaque colis avec les détails du destinataire
                const enrichissements = colis.map(col =>
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

                // Attendre que tous les enrichissements soient terminés
                if (enrichissements.length === 0) {
                    this.colis.set([]);
                    this.loading.set(false);
                    return;
                }

                forkJoin(enrichissements).subscribe({
                    next: (colisEnrichis) => {
                        this.colis.set(colisEnrichis);
                        this.loading.set(false);
                    },
                    error: () => {
                        this.colis.set(colis as ColisEnrichi[]);
                        this.loading.set(false);
                    }
                });
            },
            error: (error) => {
                console.error('Erreur chargement colis:', error);
                this.errorMessage.set('Erreur lors du chargement des colis');
                this.loading.set(false);
            }
        });
    }

    filtrerParStatut(statut: string): void {
        this.filtreStatut.set(statut);
    }

    changerFiltre(statut: string): void {
        this.filtreStatut.set(statut);
    }

    get colisFiltres(): ColisEnrichi[] {
        const statut = this.filtreStatut();
        if (statut === 'tous') {
            return this.colis();
        }
        return this.colis().filter(c => c.statut === statut);
    }

    getStatutClass(statut: string): string {
        const classes: { [key: string]: string } = {
            'CREE': 'statut-preparation',
            'EN_TRANSIT': 'statut-transit',
            'LIVRE': 'statut-livre',
            'RETOURNE': 'statut-retourne',
            'ANNULE': 'statut-annule'
        };
        return classes[statut] || 'statut-default';
    }

    getStatutLabel(statut: string): string {
        const labels: { [key: string]: string } = {
            'CREE': 'En préparation',
            'EN_TRANSIT': 'En transit',
            'LIVRE': 'Livré',
            'RETOURNE': 'Retourné',
            'ANNULE': 'Annulé'
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

    getPrioriteLabel(priorite: string): string {
        const labels: { [key: string]: string } = {
            'HAUTE': 'Haute',
            'MOYENNE': 'Moyenne',
            'BASSE': 'Basse'
        };
        return labels[priorite] || priorite;
    }
}
