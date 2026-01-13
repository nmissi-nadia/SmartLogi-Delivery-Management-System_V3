import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Livreur {
    id: string;
    nom: string;
    prenom: string;
    telephone: string;
    vehicule?: string;
    zoneId?: string;
    userId?: string;
}

export interface CreateLivreurDTO {
    nom: string;
    prenom: string;
    telephone: string;
    vehicule?: string;
    zoneId?: string;
    userId?: string;
}

/**
 * Service pour gérer les livreurs
 */
@Injectable({
    providedIn: 'root'
})
export class LivreurService {
    private readonly http = inject(HttpClient);
    private readonly API_URL = `${environment.apiUrl}/api/livreurs`;

    /**
     * Récupère la liste de tous les livreurs
     */
    getAllLivreurs(): Observable<Livreur[]> {
        return this.http.get<Livreur[]>(this.API_URL);
    }

    /**
     * Récupère un livreur par son ID
     */
    getLivreurById(id: string): Observable<Livreur> {
        return this.http.get<Livreur>(`${this.API_URL}/${id}`);
    }

    /**
     * Crée un nouveau livreur
     */
    createLivreur(livreur: CreateLivreurDTO): Observable<Livreur> {
        return this.http.post<Livreur>(this.API_URL, livreur);
    }

    /**
     * Met à jour un livreur existant
     */
    updateLivreur(id: string, livreur: Partial<CreateLivreurDTO>): Observable<Livreur> {
        return this.http.put<Livreur>(`${this.API_URL}/${id}`, livreur);
    }

    /**
     * Supprime un livreur
     */
    deleteLivreur(id: string): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }
}
