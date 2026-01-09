import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { HistoriqueLivraison } from './colis.service';

/**
 * Service pour gérer l'historique des livraisons
 */
@Injectable({
    providedIn: 'root'
})
export class HistoriqueService {
    private readonly http = inject(HttpClient);
    private readonly API_URL = `${environment.apiUrl}/api`;

    /**
     * Récupère l'historique d'un colis spécifique
     */
    getHistoriqueForColis(colisId: string): Observable<HistoriqueLivraison[]> {
        return this.http.get<HistoriqueLivraison[]>(`${this.API_URL}/colis/${colisId}/historique`);
    }

    /**
     * Récupère tout l'historique
     */
    getAllHistorique(): Observable<HistoriqueLivraison[]> {
        return this.http.get<HistoriqueLivraison[]>(`${this.API_URL}/historiques`);
    }

    /**
     * Récupère un historique par son ID
     */
    getHistoriqueById(id: string): Observable<HistoriqueLivraison> {
        return this.http.get<HistoriqueLivraison>(`${this.API_URL}/historiques/${id}`);
    }
}
