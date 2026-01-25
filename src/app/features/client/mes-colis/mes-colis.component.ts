import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { AppState } from '../../../store/colis/colis.state';
import * as ColisActions from '../../../store/colis/colis.actions';
import * as ColisSelectors from '../../../store/colis/colis.selectors';
import { selectUserId } from '../../../store/auth/auth.selectors';


/**
 * Composant pour afficher la liste des colis du client
 * Utilise NgRx Store pour la gestion d'état
 */
@Component({
    selector: 'app-mes-colis',
    standalone: true,
    imports: [CommonModule, RouterLink, NavbarComponent],
    templateUrl: './mes-colis.component.html',
    styleUrl: './mes-colis.component.css'
})
export class MesColisComponent implements OnInit {
    private readonly store = inject(Store<AppState>);

    // Sélection des données depuis le store
    colis$ = this.store.select(ColisSelectors.selectFilteredColis);
    loading$ = this.store.select(ColisSelectors.selectColisLoading);
    error$ = this.store.select(ColisSelectors.selectColisError);
    filters$ = this.store.select(ColisSelectors.selectColisFilters);
    stats$ = this.store.select(ColisSelectors.selectColisCountByStatut);

    ngOnInit(): void {
        // Récupérer l'ID du client depuis le store
        this.store.select(selectUserId).subscribe(userId => {
            if (userId) {
                this.store.dispatch(ColisActions.loadColisByClient({ clientId: userId.toString() }));
            }
        });
    }



    /**
     * Change le filtre de statut
     */
    changerFiltre(statut: string): void {
        this.store.dispatch(ColisActions.setColisStatutFilter({ statut }));
    }

    /**
     * Sélectionne un colis
     */
    selectColis(colisId: string): void {
        this.store.dispatch(ColisActions.selectColis({ colisId }));
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

    getPrioriteLabel(priorite: string): string {
        const labels: { [key: string]: string } = {
            'HAUTE': 'Haute',
            'MOYENNE': 'Moyenne',
            'BASSE': 'Basse'
        };
        return labels[priorite] || priorite;
    }
}
