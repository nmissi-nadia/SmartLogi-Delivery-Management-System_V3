import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ColisFilters {
    statut?: string;
    ville?: string;
    priorite?: string;
    zoneId?: string;
    dateDebut?: string;
    dateFin?: string;
    destinataireId?: string;
    page?: number;
    size?: number;
}

export interface ColisPage {
    content: any[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}

export interface ColisStats {
    [key: string]: any;
}

/**
 * Service pour la gestion des colis côté gestionnaire
 */
@Injectable({
    providedIn: 'root'
})
export class GestionnaireColisService {
    private readonly http = inject(HttpClient);
    private readonly API_URL = `${environment.apiUrl}/api`;

    /**
     * Récupère tous les colis avec pagination et filtres
     */
    getAllColis(filters: ColisFilters = {}): Observable<ColisPage> {
        let params = new HttpParams();

        if (filters.statut) params = params.set('statut', filters.statut);
        if (filters.ville) params = params.set('ville', filters.ville);
        if (filters.priorite) params = params.set('priorite', filters.priorite);
        if (filters.zoneId) params = params.set('zoneId', filters.zoneId);
        if (filters.dateDebut) params = params.set('dateDebut', filters.dateDebut);
        if (filters.dateFin) params = params.set('dateFin', filters.dateFin);
        if (filters.destinataireId) params = params.set('destinataireId', filters.destinataireId);
        if (filters.page !== undefined) params = params.set('page', filters.page.toString());
        if (filters.size !== undefined) params = params.set('size', filters.size.toString());

        return this.http.get<ColisPage>(`${this.API_URL}/colis`, { params });
    }

    /**
     * Recherche des colis par mot-clé
     */
    searchColis(keyword: string, page: number = 0, size: number = 20): Observable<ColisPage> {
        let params = new HttpParams()
            .set('keyword', keyword)
            .set('page', page.toString())
            .set('size', size.toString());

        return this.http.get<ColisPage>(`${this.API_URL}/colis/recherche`, { params });
    }

    /**
     * Assigne un livreur à un colis
     */
    assignerLivreur(colisId: string, livreurId: string): Observable<void> {
        return this.http.post<void>(`${this.API_URL}/gestionnaires/colis/${colisId}/assigner`, null, {
            params: { livreurId }
        });
    }

    /**
     * Modifie le statut d'un colis
     */
    modifierStatut(colisId: string, statut: string, commentaire?: string): Observable<any> {
        return this.http.put(`${this.API_URL}/gestionnaires/colis/${colisId}/traiter`, {
            statut,
            commentaire
        });
    }

    /**
     * Modifie un colis
     */
    modifierColis(colisId: string, colis: any): Observable<any> {
        return this.http.put(`${this.API_URL}/colis/${colisId}`, colis);
    }

    /**
     * Supprime un colis
     */
    supprimerColis(colisId: string): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/colis/${colisId}`);
    }

    /**
     * Récupère l'historique d'un colis
     */
    getHistorique(colisId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.API_URL}/colis/${colisId}/historique`);
    }

    /**
     * Récupère les statistiques
     */
    getStatistiques(livreurId?: string, zoneId?: string): Observable<ColisStats> {
        let params = new HttpParams();
        if (livreurId) params = params.set('livreurId', livreurId);
        if (zoneId) params = params.set('zoneId', zoneId);

        return this.http.get<ColisStats>(`${this.API_URL}/gestionnaires/statistiques`, { params });
    }

    /**
     * Groupe les colis par un champ
     */
    groupBy(field: string): Observable<any> {
        return this.http.get(`${this.API_URL}/gestionnaires/colis/group-by/${field}`);
    }

    /**
     * Récupère les colis non assignés
     */
    getColisNonAssignes(): Observable<any[]> {
        return this.http.get<any[]>(`${this.API_URL}/colis/non-assignes`);
    }

    /**
     * Récupère les statistiques overview
     */
    getStatistiquesOverview(): Observable<{ [key: string]: number }> {
        return this.http.get<{ [key: string]: number }>(`${this.API_URL}/colis/statistiques/overview`);
    }
}
