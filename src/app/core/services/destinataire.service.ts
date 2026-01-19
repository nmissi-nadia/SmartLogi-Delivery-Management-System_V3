import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { Colis } from './colis.service';

export interface Destinataire {
    id: string;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    adresse: string;
}

export interface CreateDestinataireDTO {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    adresse: string;
}

/**
 * Service pour gérer les destinataires
 */
@Injectable({
    providedIn: 'root'
})
export class DestinataireService {
    private readonly http = inject(HttpClient);
    private readonly API_URL = `${environment.apiUrl}/api/destinataires`;
    private readonly PUBLIC_API_URL = `${environment.apiUrl}/api/public/destinataires`;

    // ========================================
    // ENDPOINTS PUBLICS (sans authentification)
    // ========================================

    /**
     * Recherche un destinataire par nom et email (endpoint public)
     * Utilisé pour le suivi rapide sans authentification
     */
    searchByNomAndEmail(nom: string, email: string): Observable<Destinataire> {
        const params = new HttpParams()
            .set('nom', nom)
            .set('email', email);

        return this.http.get<Destinataire>(`${this.PUBLIC_API_URL}/search`, { params });
    }

    /**
     * Récupère tous les colis d'un destinataire (endpoint public)
     */
    getColisPublic(destinataireId: string): Observable<Colis[]> {
        return this.http.get<Colis[]>(`${this.PUBLIC_API_URL}/${destinataireId}/colis`);
    }

    /**
     * Confirme la réception d'un colis (endpoint public)
     */
    confirmerReceptionPublic(destinataireId: string, colisId: string): Observable<Colis> {
        return this.http.post<Colis>(
            `${this.PUBLIC_API_URL}/${destinataireId}/colis/${colisId}/confirmation`,
            {}
        );
    }

    // ========================================
    // ENDPOINTS PROTÉGÉS (avec authentification)
    // ========================================

    /**
     * Récupère la liste de tous les destinataires
     */
    getDestinataires(): Observable<Destinataire[]> {
        return this.http.get<Destinataire[]>(this.API_URL);
    }

    /**
     * Récupère un destinataire par son ID
     */
    getDestinataireById(id: string): Observable<Destinataire> {
        return this.http.get<Destinataire>(`${this.API_URL}/${id}`);
    }

    /**
     * Crée un nouveau destinataire
     */
    createDestinataire(destinataire: CreateDestinataireDTO): Observable<Destinataire> {
        return this.http.post<Destinataire>(this.API_URL, destinataire);
    }

    /**
     * Met à jour un destinataire existant
     */
    updateDestinataire(id: string, destinataire: Partial<CreateDestinataireDTO>): Observable<Destinataire> {
        return this.http.put<Destinataire>(`${this.API_URL}/${id}`, destinataire);
    }

    /**
     * Supprime un destinataire
     */
    deleteDestinataire(id: string): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }

    /**
     * Récupère les détails d'un colis pour un destinataire (protégé)
     */
    getColisDetails(destinataireId: string, colisId: string): Observable<any> {
        return this.http.get<any>(`${this.API_URL}/${destinataireId}/colis/${colisId}`);
    }

    /**
     * Confirme la réception d'un colis (protégé)
     */
    confirmerReception(destinataireId: string, colisId: string): Observable<any> {
        return this.http.post<any>(
            `${this.API_URL}/${destinataireId}/colis/${colisId}/confirmation`,
            {}
        );
    }
}
