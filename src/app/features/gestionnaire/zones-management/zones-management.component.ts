import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ZoneService } from '../../../core/services/zone.service';
import type { Zone } from '../../../core/services/zone.service';

@Component({
    selector: 'app-zones-management',
    standalone: true,
    imports: [CommonModule, FormsModule, NavbarComponent],
    templateUrl: './zones-management.component.html',
    styleUrl: './zones-management.component.css'
})
export class ZonesManagementComponent implements OnInit {
    private readonly zoneService = inject(ZoneService);

    zones = signal<Zone[]>([]);
    loading = signal(true);
    errorMessage = signal<string | null>(null);

    showModal = signal(false);
    isEditMode = signal(false);
    currentZone = signal<Zone | null>(null);

    formData = signal({
        nom: '',
        codePostal: ''
    });

    ngOnInit(): void {
        this.chargerZones();
    }

    private chargerZones(): void {
        this.loading.set(true);
        this.errorMessage.set(null);

        this.zoneService.getZones().subscribe({
            next: (zones) => {
                this.zones.set(zones);
                this.loading.set(false);
            },
            error: (error) => {
                console.error('Erreur chargement zones:', error);
                this.errorMessage.set('Erreur lors du chargement des zones');
                this.loading.set(false);
            }
        });
    }

    ouvrirModalCreation(): void {
        this.isEditMode.set(false);
        this.currentZone.set(null);
        this.formData.set({
            nom: '',
            codePostal: ''
        });
        this.showModal.set(true);
    }

    ouvrirModalModification(zone: Zone): void {
        this.isEditMode.set(true);
        this.currentZone.set(zone);
        this.formData.set({
            nom: zone.nom,
            codePostal: zone.codePostal
        });
        this.showModal.set(true);
    }

    fermerModal(): void {
        this.showModal.set(false);
        this.currentZone.set(null);
    }

    soumettre(): void {
        const data = this.formData();

        if (!data.nom || !data.codePostal) {
            alert('Veuillez remplir tous les champs');
            return;
        }

        if (this.isEditMode()) {
            this.modifierZone();
        } else {
            this.creerZone();
        }
    }

    private creerZone(): void {
        const newZone = this.formData();

        this.zoneService.createZone(newZone).subscribe({
            next: () => {
                this.chargerZones();
                this.fermerModal();
            },
            error: (error) => {
                console.error('Erreur création zone:', error);
                alert('Erreur lors de la création de la zone');
            }
        });
    }

    private modifierZone(): void {
        const zone = this.currentZone();
        if (!zone) return;

        const updatedZone = this.formData();

        this.zoneService.updateZone(zone.id, updatedZone).subscribe({
            next: () => {
                this.chargerZones();
                this.fermerModal();
            },
            error: (error) => {
                console.error('Erreur modification zone:', error);
                alert('Erreur lors de la modification de la zone');
            }
        });
    }

    supprimerZone(zoneId: string): void {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette zone ?')) {
            this.zoneService.deleteZone(zoneId).subscribe({
                next: () => {
                    this.chargerZones();
                },
                error: (error) => {
                    console.error('Erreur suppression zone:', error);
                    alert('Erreur lors de la suppression de la zone');
                }
            });
        }
    }
}
