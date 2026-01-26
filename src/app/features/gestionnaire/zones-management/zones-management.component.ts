import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
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
    imports: [CommonModule, FormsModule, NavbarComponent, ZoneFormComponent],
    templateUrl: './zones-management.component.html',
    styleUrl: './zones-management.component.css'
})
export class ZonesManagementComponent implements OnInit {
    private readonly store = inject(Store<AppState>);

    // Conversion des observables en signals
    zones = toSignal(this.store.select(ZonesSelectors.selectAllZones), { initialValue: [] });
    loading = toSignal(this.store.select(ZonesSelectors.selectZonesLoading), { initialValue: false });
    error = toSignal(this.store.select(ZonesSelectors.selectZonesError), { initialValue: null });

    errorMessage = computed(() => this.error());

    // État local pour l'UI
    showModal = signal(false);
    isEditMode = signal(false);
    selectedZone = signal<Zone | null>(null);

    // Données du formulaire
    formData = signal<CreateZoneDTO>({
        nom: '',
        codePostal: ''
    });

    ngOnInit(): void {
        this.store.dispatch(ZonesActions.loadZones());
    }

    ouvrirModalCreation(): void {
        this.isEditMode.set(false);
        this.selectedZone.set(null);
        this.formData.set({ nom: '', codePostal: '' });
        this.showModal.set(true);
    }

    ouvrirModalModification(zone: Zone): void {
        this.isEditMode.set(true);
        this.selectedZone.set(zone);
        this.formData.set({ nom: zone.nom, codePostal: zone.codePostal });
        this.showModal.set(true);
    }

    fermerModal(): void {
        this.showModal.set(false);
        this.selectedZone.set(null);
        this.formData.set({ nom: '', codePostal: '' });
    }

    soumettre(): void {
        const data = this.formData();
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

