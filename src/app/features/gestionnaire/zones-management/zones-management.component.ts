import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ZoneFormComponent } from '../../../shared/components/forms/zone-form/zone-form.component';
import { Zone, CreateZoneDTO } from '../../../core/services/zone.service';
import { AppState } from '../../../store';
import * as ZonesActions from '../../../store/zones/zones.actions';
import * as ZonesSelectors from '../../../store/zones/zones.selectors';

/**
 * Composant pour gérer les zones de livraison (Gestionnaire)
 * Permet de lister, créer, modifier et supprimer des zones via NgRx
 */
@Component({
    selector: 'app-zones-management',
    standalone: true,
    imports: [CommonModule, NavbarComponent, ZoneFormComponent],
    templateUrl: './zones-management.component.html',
    styleUrl: './zones-management.component.css'
})
export class ZonesManagementComponent implements OnInit {
    private readonly store = inject(Store<AppState>);

    // Sélecteurs NgRx
    zones$ = this.store.select(ZonesSelectors.selectAllZones);
    loading$ = this.store.select(ZonesSelectors.selectZonesLoading);
    error$ = this.store.select(ZonesSelectors.selectZonesError);

    // État local pour l'UI
    showModal = signal(false);
    isEditMode = signal(false);
    selectedZone = signal<Zone | null>(null);

    ngOnInit(): void {
        this.store.dispatch(ZonesActions.loadZones());
    }

    ouvrirModalCreation(): void {
        this.isEditMode.set(false);
        this.selectedZone.set(null);
        this.showModal.set(true);
    }

    ouvrirModalModification(zone: Zone): void {
        this.isEditMode.set(true);
        this.selectedZone.set(zone);
        this.showModal.set(true);
    }

    fermerModal(): void {
        this.showModal.set(false);
        this.selectedZone.set(null);
    }

    onFormSubmit(data: CreateZoneDTO): void {
        if (this.isEditMode() && this.selectedZone()) {
            this.store.dispatch(ZonesActions.updateZone({
                id: this.selectedZone()!.id,
                zone: data as Partial<CreateZoneDTO>
            }));
        } else {
            this.store.dispatch(ZonesActions.createZone({ zone: data }));
        }
        this.fermerModal();
    }

    supprimerZone(id: string): void {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette zone ?')) {
            this.store.dispatch(ZonesActions.deleteZone({ id }));
        }
    }
}

