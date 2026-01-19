import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

/**
 * Page d'accueil de SmartLogi
 * Landing page avec présentation et liens vers connexion/suivi
 */
@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent {
    features = [
        {
            icon: '📦',
            title: 'Gestion des Colis',
            description: 'Suivez vos colis en temps réel avec notre système de tracking avancé'
        },
        {
            icon: '🚚',
            title: 'Livraison Rapide',
            description: 'Optimisation des tournées pour des livraisons efficaces et rapides'
        },
        {
            icon: '📊',
            title: 'Statistiques',
            description: 'Tableaux de bord détaillés pour analyser vos performances'
        },
        {
            icon: '🔒',
            title: 'Sécurisé',
            description: 'Vos données sont protégées avec les dernières technologies'
        }
    ];

    stats = [
        { value: '10K+', label: 'Colis livrés' },
        { value: '500+', label: 'Clients satisfaits' },
        { value: '50+', label: 'Livreurs actifs' },
        { value: '99%', label: 'Taux de réussite' }
    ];
}
