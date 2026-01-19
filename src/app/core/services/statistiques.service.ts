import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface StatistiquesOverview {
    totalColis: number;
    colisEnAttente: number;
    colisEnCours: number;
    colisLivres: number;
}

export interface StatistiquesEvolution {
    date: string;
    cree: number;
    enTransit: number;
    livre: number;
}

export interface StatistiquesParZone {
    zone: string;
    nombreColis: number;
    pourcentage: number;
}

export interface StatistiquesParLivreur {
    livreurId: string;
    livreurNom: string;
    colisLivres: number;
    colisEnCours: number;
    tauxReussite: number;
}

/**
 * Service pour gérer les statistiques
 */
@Injectable({
    providedIn: 'root'
})
export class StatistiquesService {
    private readonly http = inject(HttpClient);
    private readonly API_URL = `${environment.apiUrl}/api/colis/statistiques`;

    /**
     * Récupère les statistiques générales
     */
    getStatistiquesOverview(): Observable<StatistiquesOverview> {
        return this.http.get<StatistiquesOverview>(`${this.API_URL}/overview`);
    }

    /**
     * Récupère l'évolution des livraisons sur les 7 derniers jours
     */
    getEvolutionLivraisons(jours: number = 7): Observable<StatistiquesEvolution[]> {
        return this.http.get<StatistiquesEvolution[]>(`${this.API_URL}/evolution?jours=${jours}`);
    }

    /**
     * Récupère les statistiques par zone
     */
    getStatistiquesParZone(): Observable<StatistiquesParZone[]> {
        return this.http.get<StatistiquesParZone[]>(`${this.API_URL}/par-zone`);
    }

    /**
     * Récupère les statistiques par livreur
     */
    getStatistiquesParLivreur(): Observable<StatistiquesParLivreur[]> {
        return this.http.get<StatistiquesParLivreur[]>(`${this.API_URL}/par-livreur`);
    }

    /**
     * Récupère les statistiques par statut (pour pie chart)
     */
    getStatistiquesParStatut(): Observable<{ statut: string; nombre: number }[]> {
        return this.http.get<{ statut: string; nombre: number }[]>(`${this.API_URL}/par-statut`);
    }
}
