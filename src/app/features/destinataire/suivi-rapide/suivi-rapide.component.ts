import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DestinataireService } from '../../../core/services/destinataire.service';
import { ColisService, type Colis } from '../../../core/services/colis.service';

/**
 * Composant pour le suivi rapide des colis par les destinataires
 * Permet l'accès sans authentification avec nom + email
 */
@Component({
    selector: 'app-suivi-rapide',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './suivi-rapide.component.html',
    styleUrl: './suivi-rapide.component.css'
})
export class SuiviRapideComponent {
    private readonly destinataireService = inject(DestinataireService);
    private readonly colisService = inject(ColisService);

    // Formulaire
    nom = signal('');
    email = signal('');

    // Données
    destinataireId = signal<string | null>(null);
    colis = signal<Colis[]>([]);

    // États
    loading = signal(false);
    errorMessage = signal<string | null>(null);
    showResults = signal(false);
    successMessage = signal<string | null>(null);

    /**
     * Recherche les colis du destinataire
     */
    rechercherColis(): void {
        const nomValue = this.nom().trim();
        const emailValue = this.email().trim();

        // Validation
        if (!nomValue || !emailValue) {
            this.errorMessage.set('Veuillez remplir tous les champs');
            return;
        }

        if (!this.isValidEmail(emailValue)) {
            this.errorMessage.set('Email invalide');
            return;
        }

        this.loading.set(true);
        this.errorMessage.set(null);
        this.successMessage.set(null);

        // Utiliser le nouvel endpoint public de recherche
        this.destinataireService.searchByNomAndEmail(nomValue, emailValue).subscribe({
            next: (destinataire) => {
                this.destinataireId.set(destinataire.id);
                this.chargerColis(destinataire.id);
            },
            error: (error) => {
                console.error('Erreur recherche destinataire:', error);
                if (error.status === 404) {
                    this.errorMessage.set('Aucun destinataire trouvé avec ces informations');
                } else {
                    this.errorMessage.set('Erreur lors de la recherche');
                }
                this.loading.set(false);
                this.showResults.set(false);
            }
        });
    }

    /**
     * Charge les colis du destinataire via l'endpoint public
     */
    private chargerColis(destinataireId: string): void {
        this.destinataireService.getColisPublic(destinataireId).subscribe({
            next: (colisList) => {
                this.colis.set(colisList);
                this.showResults.set(true);
                this.loading.set(false);

                if (colisList.length === 0) {
                    this.errorMessage.set('Aucun colis trouvé pour ce destinataire');
                }
            },
            error: (error) => {
                console.error('Erreur chargement colis:', error);
                this.errorMessage.set('Erreur lors du chargement des colis');
                this.loading.set(false);
            }
        });
    }

    /**
     * Confirme la réception d'un colis via l'endpoint public
     */
    confirmerReception(colis: Colis): void {
        const destId = this.destinataireId();
        if (!destId) return;

        if (!confirm(`Confirmer la réception du colis ${colis.id.substring(0, 8)} ?`)) {
            return;
        }

        this.loading.set(true);
        this.errorMessage.set(null);

        this.destinataireService.confirmerReceptionPublic(destId, colis.id).subscribe({
            next: () => {
                this.successMessage.set('Réception confirmée avec succès !');
                this.chargerColis(destId);
            },
            error: (error) => {
                console.error('Erreur confirmation:', error);
                if (error.status === 403) {
                    this.errorMessage.set('Ce colis ne vous appartient pas');
                } else if (error.status === 404) {
                    this.errorMessage.set('Colis non trouvé');
                } else {
                    this.errorMessage.set('Erreur lors de la confirmation');
                }
                this.loading.set(false);
            }
        });
    }

    /**
     * Réinitialise le formulaire
     */
    nouvelleRecherche(): void {
        this.nom.set('');
        this.email.set('');
        this.colis.set([]);
        this.showResults.set(false);
        this.errorMessage.set(null);
        this.successMessage.set(null);
        this.destinataireId.set(null);
    }

    /**
     * Valide le format email
     */
    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
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
