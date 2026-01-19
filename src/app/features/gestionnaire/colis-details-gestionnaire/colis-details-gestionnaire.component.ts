import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { GestionnaireColisService } from '../../../core/services/gestionnaire-colis.service';
import { LivreurService, type Livreur } from '../../../core/services/livreur.service';
import { ZoneService } from '../../../core/services/zone.service';
import { ColisService } from '../../../core/services/colis.service';

/**
 * Composant pour afficher et gérer les détails d'un colis (Gestionnaire)
 */
@Component({
    selector: 'app-colis-details-gestionnaire',
    standalone: true,
    imports: [CommonModule, FormsModule, NavbarComponent, RouterLink],
    templateUrl: './colis-details-gestionnaire.component.html',
    styleUrl: './colis-details-gestionnaire.component.css'
})
export class ColisDetailsGestionnaireComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly colisService = inject(ColisService);
    private readonly gestionnaireColisService = inject(GestionnaireColisService);
    private readonly livreurService = inject(LivreurService);
    private readonly zoneService = inject(ZoneService);

    // Données
    colis = signal<any | null>(null);
    livreurs = signal<Livreur[]>([]);
    historique = signal<any[]>([]);
    zoneDetails = signal<any | null>(null);

    // États
    loading = signal(true);
    errorMessage = signal<string | null>(null);
    isEditMode = signal(false);

    // Formulaires
    selectedLivreur = signal('');
    selectedStatut = signal('');
    commentaire = signal('');

    // Formulaire d'édition
    editForm = signal({
        destinataireNom: '',
        destinatairePrenom: '',
        destinataireTelephone: '',
        destinataireAdresse: '',
        ville: '',
        codePostal: '',
        priorite: '',
        description: ''
    });

    // Options
    statutOptions = ['CREE', 'COLLECTE', 'EN_STOCK', 'EN_TRANSIT', 'LIVRE'];
    prioriteOptions = ['HAUTE', 'MOYENNE', 'BASSE'];

    // Modals
    showAssignModal = signal(false);
    showStatutModal = signal(false);

    ngOnInit(): void {
        const colisId = this.route.snapshot.paramMap.get('id');
        if (colisId) {
            this.chargerColis(colisId);
            this.chargerHistorique(colisId);
        } else {
            this.router.navigate(['/gestionnaire/colis-list']);
        }
    }

    /**
     * Charge les détails du colis
     */
    private chargerColis(colisId: string): void {
        this.loading.set(true);
        this.errorMessage.set(null);

        this.colisService.getColisById(colisId).subscribe({
            next: (colis) => {
                this.colis.set(colis);
                this.initEditForm(colis);

                // Charger les détails de la zone si elle existe
                if (colis.zoneId) {
                    this.chargerDetailsZone(colis.zoneId);
                    this.chargerLivreursParZone(colis.zoneId);
                } else {
                    this.chargerTousLesLivreurs();
                }

                this.loading.set(false);
            },
            error: (error) => {
                console.error('Erreur chargement colis:', error);
                this.errorMessage.set('Erreur lors du chargement du colis');
                this.loading.set(false);
            }
        });
    }

    /**
     * Charge les détails de la zone
     */
    private chargerDetailsZone(zoneId: string): void {
        this.zoneService.getZoneById(zoneId).subscribe({
            next: (zone) => {
                this.zoneDetails.set(zone);
                // Enrichir le colis avec le nom de la zone
                const currentColis = this.colis();
                if (currentColis) {
                    currentColis.zoneNom = zone.nom;
                    this.colis.set({ ...currentColis });
                }
            },
            error: (error) => {
                console.error('Erreur chargement zone:', error);
            }
        });
    }

    /**
     * Initialise le formulaire d'édition
     */
    private initEditForm(colis: any): void {
        this.editForm.set({
            destinataireNom: colis.destinataireNom || '',
            destinatairePrenom: colis.destinatairePrenom || '',
            destinataireTelephone: colis.destinataireTelephone || '',
            destinataireAdresse: colis.destinataireAdresse || '',
            ville: colis.ville || '',
            codePostal: colis.codePostal || '',
            priorite: colis.priorite || '',
            description: colis.description || ''
        });
    }

    /**
     * Charge les livreurs de la même zone que le colis
     */
    private chargerLivreursParZone(zoneId: string): void {
        this.livreurService.getAllLivreurs().subscribe({
            next: (livreurs) => {
                // Filtrer les livreurs par zone
                const livreursZone = livreurs.filter(l => l.zoneId === zoneId);
                this.livreurs.set(livreursZone);
            },
            error: (error) => {
                console.error('Erreur chargement livreurs:', error);
            }
        });
    }

    /**
     * Charge tous les livreurs (si pas de zone)
     */
    private chargerTousLesLivreurs(): void {
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
     * Charge l'historique du colis
     */
    private chargerHistorique(colisId: string): void {
        this.gestionnaireColisService.getHistorique(colisId).subscribe({
            next: (historique) => {
                this.historique.set(historique);
            },
            error: (error) => {
                console.error('Erreur chargement historique:', error);
            }
        });
    }

    /**
     * Active le mode édition
     */
    activerModeEdition(): void {
        this.isEditMode.set(true);
    }

    /**
     * Annule le mode édition
     */
    annulerEdition(): void {
        const colis = this.colis();
        if (colis) {
            this.initEditForm(colis);
        }
        this.isEditMode.set(false);
    }

    /**
     * Sauvegarde les modifications
     */
    sauvegarderModifications(): void {
        const colis = this.colis();
        if (!colis) return;

        const form = this.editForm();
        const updatedColis = {
            ...colis,
            ...form
        };

        this.gestionnaireColisService.modifierColis(colis.id, updatedColis).subscribe({
            next: (updated) => {
                this.colis.set(updated);
                this.isEditMode.set(false);
                alert('Colis modifié avec succès');
            },
            error: (error) => {
                console.error('Erreur modification colis:', error);
                alert('Erreur lors de la modification du colis');
            }
        });
    }

    /**
     * Ouvre le modal d'assignation
     */
    ouvrirModalAssignation(): void {
        this.selectedLivreur.set('');
        this.showAssignModal.set(true);
    }

    /**
     * Assigne un livreur
     */
    assignerLivreur(): void {
        const colis = this.colis();
        const livreurId = this.selectedLivreur();

        if (!colis || !livreurId) {
            alert('Veuillez sélectionner un livreur');
            return;
        }

        this.gestionnaireColisService.assignerLivreur(colis.id, livreurId).subscribe({
            next: () => {
                this.chargerColis(colis.id);
                this.fermerModals();
                alert('Livreur assigné avec succès');
            },
            error: (error) => {
                console.error('Erreur assignation livreur:', error);
                alert('Erreur lors de l\'assignation du livreur');
            }
        });
    }

    /**
     * Assigne un livreur directement (depuis la liste)
     */
    assignerLivreurDirect(livreurId: string): void {
        const colis = this.colis();
        if (!colis) return;

        if (confirm('Voulez-vous assigner ce livreur à ce colis ?')) {
            this.gestionnaireColisService.assignerLivreur(colis.id, livreurId).subscribe({
                next: () => {
                    this.chargerColis(colis.id);
                    alert('Livreur assigné avec succès');
                },
                error: (error) => {
                    console.error('Erreur assignation livreur:', error);
                    alert('Erreur lors de l\'assignation du livreur');
                }
            });
        }
    }

    /**
     * Ouvre le modal de modification de statut
     */
    ouvrirModalStatut(): void {
        const colis = this.colis();
        if (colis) {
            this.selectedStatut.set(colis.statut || '');
            this.commentaire.set('');
            this.showStatutModal.set(true);
        }
    }

    /**
     * Modifie le statut
     */
    modifierStatut(): void {
        const colis = this.colis();
        const statut = this.selectedStatut();

        if (!colis || !statut) {
            alert('Veuillez sélectionner un statut');
            return;
        }

        this.gestionnaireColisService.modifierStatut(colis.id, statut, this.commentaire()).subscribe({
            next: () => {
                this.chargerColis(colis.id);
                this.chargerHistorique(colis.id);
                this.fermerModals();
                alert('Statut modifié avec succès');
            },
            error: (error) => {
                console.error('Erreur modification statut:', error);
                alert('Erreur lors de la modification du statut');
            }
        });
    }

    /**
     * Ferme tous les modals
     */
    fermerModals(): void {
        this.showAssignModal.set(false);
        this.showStatutModal.set(false);
    }

    /**
     * Retourne le badge de couleur selon le statut
     */
    getStatutBadgeClass(statut: string): string {
        const classes: { [key: string]: string } = {
            'CREE': 'badge-warning',
            'COLLECTE': 'badge-info',
            'EN_STOCK': 'badge-secondary',
            'EN_TRANSIT': 'badge-primary',
            'LIVRE': 'badge-success'
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
}
