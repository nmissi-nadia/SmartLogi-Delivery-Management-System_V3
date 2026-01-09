import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface StatistiquesOverview {
    totalColis: number;
    colisEnAttente: number;
    colisEnCours: number;
    colisLivres: number;
}

/**
 * Service pour gérer les statistiques
 */
@Injectable({
    providedIn: 'root'
})
export class StatistiquesService {
    private readonly http = inject(HttpClient);
    private readonly API_URL = `${environment.apiUrl}/api/gestionnaires`;

    /**
     * Récupère les statistiques globales
     */
    getStatistiquesOverview(): Observable<StatistiquesOverview> {
        return this.http.get<StatistiquesOverview>(`${this.API_URL}/statistiques`);
    }

    /**
     * Récupère les statistiques avec filtres
     */
    getStatistiques(livreurId?: string, zoneId?: string): Observable<any> {
        let params = new HttpParams();
        if (livreurId) params = params.set('livreurId', livreurId);
        if (zoneId) params = params.set('zoneId', zoneId);

        return this.http.get(`${this.API_URL}/statistiques`, { params });
    }
}
