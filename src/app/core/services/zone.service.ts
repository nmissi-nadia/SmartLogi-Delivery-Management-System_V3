import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Zone {
    id: string;
    nom: string;
    codePostal: string;
}

export interface CreateZoneDTO {
    nom: string;
    codePostal: string;
}

/**
 * Service pour gérer les zones
 */
@Injectable({
    providedIn: 'root'
})
export class ZoneService {
    private readonly http = inject(HttpClient);
    private readonly API_URL = `${environment.apiUrl}/api/zones`;

    /**
     * Récupère la liste de toutes les zones
     */
    getZones(): Observable<Zone[]> {
        return this.http.get<Zone[]>(this.API_URL);
    }

    /**
     * Récupère une zone par son ID
     */
    getZoneById(id: string): Observable<Zone> {
        return this.http.get<Zone>(`${this.API_URL}/${id}`);
    }

    /**
     * Crée une nouvelle zone
     */
    createZone(zone: CreateZoneDTO): Observable<Zone> {
        return this.http.post<Zone>(this.API_URL, zone);
    }

    /**
     * Met à jour une zone existante
     */
    updateZone(id: string, zone: Partial<CreateZoneDTO>): Observable<Zone> {
        return this.http.put<Zone>(`${this.API_URL}/${id}`, zone);
    }

    /**
     * Supprime une zone
     */
    deleteZone(id: string): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }
}
