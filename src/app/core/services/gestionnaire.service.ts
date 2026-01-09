import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { Colis } from './colis.service';

/**
 * Service pour les opérations spécifiques au gestionnaire
 */
@Injectable({
    providedIn: 'root'
})
export class GestionnaireService {
    private readonly http = inject(HttpClient);
    private readonly API_URL = `${environment.apiUrl}/api/gestionnaires`;

    /**
     * Récupère tous les colis (pour gestionnaire)
     */
    getAllColis(): Observable<Colis[]> {
        return this.http.get<Colis[]>(`${this.API_URL}/colis`);
    }

    /**
     * Assigne un livreur à un colis
     */
    assignerLivreur(colisId: string, livreurId: string): Observable<void> {
        return this.http.post<void>(
            `${this.API_URL}/colis/${colisId}/assigner`,
            null,
            { params: new HttpParams().set('livreurId', livreurId) }
        );
    }

    /**
     * Recherche des colis par critères
     */
    rechercherColis(statut?: string, ville?: string, priorite?: string): Observable<Colis[]> {
        let params = new HttpParams();
        if (statut) params = params.set('statut', statut);
        if (ville) params = params.set('ville', ville);
        if (priorite) params = params.set('priorite', priorite);

        return this.http.get<Colis[]>(`${this.API_URL}/colis/recherche`, { params });
    }

    /**
     * Groupe les colis par un champ spécifique
     */
    groupColisBy(field: string): Observable<any> {
        return this.http.get(`${this.API_URL}/colis/group-by/${field}`);
    }

    /**
     * Traite un colis en mettant à jour son statut
     */
    traiterColis(colisId: string, statut: string, commentaire?: string): Observable<Colis> {
        return this.http.put<Colis>(`${this.API_URL}/colis/${colisId}/traiter`, {
            statut,
            commentaire
        });
    }
}
