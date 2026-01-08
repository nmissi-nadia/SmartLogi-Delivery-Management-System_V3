import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Colis {
    id: number;
    numero: string;
    description: string;
    destinataire: string;
    adresse: string;
    statut: string;
    priorite: string;
    dateCreation: Date;
    dateEstimee?: Date;
}

/**
 * Composant pour afficher la liste des colis du client
 */
@Component({
    selector: 'app-mes-colis',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './mes-colis.component.html',
    styleUrl: './mes-colis.component.css'
})
export class MesColisComponent {
    colis = signal<Colis[]>([
        {
            id: 1,
            numero: 'COL-2026-001',
            description: 'Documents importants',
            destinataire: 'Dupont Jean',
            adresse: '15 Rue de la Paix, Paris',
            statut: 'EN_TRANSIT',
            priorite: 'URGENTE',
            dateCreation: new Date('2026-01-07'),
            dateEstimee: new Date('2026-01-09')
        },
        {
            id: 2,
            numero: 'COL-2026-002',
            description: 'Colis fragile - Électronique',
            destinataire: 'Martin Sophie',
            adresse: '42 Avenue des Champs, Lyon',
            statut: 'EN_PREPARATION',
            priorite: 'NORMALE',
            dateCreation: new Date('2026-01-08'),
            dateEstimee: new Date('2026-01-12')
        },
        {
            id: 3,
            numero: 'COL-2026-003',
            description: 'Vêtements',
            destinataire: 'Bernard Claire',
            adresse: '8 Boulevard Victor Hugo, Marseille',
            statut: 'LIVRE',
            priorite: 'NORMALE',
            dateCreation: new Date('2026-01-05'),
            dateEstimee: new Date('2026-01-07')
        }
    ]);

    filtreStatut = signal<string>('TOUS');

    get colisFiltres(): Colis[] {
        const filtre = this.filtreStatut();
        if (filtre === 'TOUS') {
            return this.colis();
        }
        return this.colis().filter(c => c.statut === filtre);
    }

    changerFiltre(statut: string): void {
        this.filtreStatut.set(statut);
    }

    getStatutLabel(statut: string): string {
        const labels: Record<string, string> = {
            'EN_PREPARATION': 'En préparation',
            'EN_TRANSIT': 'En transit',
            'EN_LIVRAISON': 'En livraison',
            'LIVRE': 'Livré',
            'RETOURNE': 'Retourné'
        };
        return labels[statut] || statut;
    }

    getStatutClass(statut: string): string {
        const classes: Record<string, string> = {
            'EN_PREPARATION': 'statut-preparation',
            'EN_TRANSIT': 'statut-transit',
            'EN_LIVRAISON': 'statut-livraison',
            'LIVRE': 'statut-livre',
            'RETOURNE': 'statut-retourne'
        };
        return classes[statut] || '';
    }

    getPrioriteClass(priorite: string): string {
        const classes: Record<string, string> = {
            'NORMALE': 'priorite-normale',
            'URGENTE': 'priorite-urgente',
            'EXPRESS': 'priorite-express'
        };
        return classes[priorite] || '';
    }
}
