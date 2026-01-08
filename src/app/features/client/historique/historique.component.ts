import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ColisHistorique {
    id: number;
    numero: string;
    description: string;
    destinataire: string;
    statut: string;
    dateCreation: Date;
    dateLivraison?: Date;
    livreur?: string;
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
export class HistoriqueComponent {
    historique = signal<ColisHistorique[]>([
        {
            id: 1,
            numero: 'COL-2026-003',
            description: 'Vêtements',
            destinataire: 'Bernard Claire',
            statut: 'LIVRE',
            dateCreation: new Date('2026-01-05'),
            dateLivraison: new Date('2026-01-07'),
            livreur: 'Mohamed Ali'
        },
        {
            id: 2,
            numero: 'COL-2025-125',
            description: 'Livres',
            destinataire: 'Dubois Marc',
            statut: 'LIVRE',
            dateCreation: new Date('2025-12-28'),
            dateLivraison: new Date('2025-12-30'),
            livreur: 'Fatima Zahra'
        },
        {
            id: 3,
            numero: 'COL-2025-098',
            description: 'Matériel de bureau',
            destinataire: 'Petit Anne',
            statut: 'LIVRE',
            dateCreation: new Date('2025-12-15'),
            dateLivraison: new Date('2025-12-18'),
            livreur: 'Hassan Youssef'
        },
        {
            id: 4,
            numero: 'COL-2025-076',
            description: 'Cadeaux',
            destinataire: 'Moreau Pierre',
            statut: 'RETOURNE',
            dateCreation: new Date('2025-12-10'),
            dateLivraison: new Date('2025-12-14')
        }
    ]);

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

    calculerDuree(dateCreation: Date, dateLivraison?: Date): string {
        if (!dateLivraison) return '-';

        const diff = dateLivraison.getTime() - dateCreation.getTime();
        const jours = Math.floor(diff / (1000 * 60 * 60 * 24));

        return `${jours} jour${jours > 1 ? 's' : ''}`;
    }

    // Méthodes pour les statistiques (éviter les arrow functions dans le template)
    getCountLivres(): number {
        return this.historique().filter(h => h.statut === 'LIVRE').length;
    }

    getCountRetournes(): number {
        return this.historique().filter(h => h.statut === 'RETOURNE').length;
    }

    getTotalCount(): number {
        return this.historique().length;
    }
}
