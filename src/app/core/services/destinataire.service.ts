import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

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
}
