import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { ClientExpediteur, CreateClientDTO, ClientPage } from '../models/client.model';

/**
 * Service pour gérer les clients expéditeurs
 */
@Injectable({
    providedIn: 'root'
})
export class ClientService {
    private readonly http = inject(HttpClient);
    private readonly API_URL = `${environment.apiUrl}/api/clients`;

    /**
     * Récupère la liste de tous les clients
     */
    getAllClients(): Observable<ClientExpediteur[]> {
        return this.http.get<ClientExpediteur[]>(this.API_URL);
    }

    /**
     * Récupère un client par son ID
     */
    getClientById(id: string): Observable<ClientExpediteur> {
        return this.http.get<ClientExpediteur>(`${this.API_URL}/${id}`);
    }

    /**
     * Recherche des clients par mot-clé avec pagination
     */
    searchClients(keyword: string, page: number, size: number): Observable<ClientPage> {
        const params = new HttpParams()
            .set('keyword', keyword)
            .set('page', page.toString())
            .set('size', size.toString());

        return this.http.get<ClientPage>(`${this.API_URL}/search`, { params });
    }

    /**
     * Crée un nouveau client
     */
    createClient(client: CreateClientDTO): Observable<ClientExpediteur> {
        return this.http.post<ClientExpediteur>(this.API_URL, client);
    }

    /**
     * Met à jour un client existant
     */
    updateClient(id: string, client: Partial<CreateClientDTO>): Observable<ClientExpediteur> {
        return this.http.put<ClientExpediteur>(`${this.API_URL}/${id}`, client);
    }

    /**
     * Supprime un client
     */
    deleteClient(id: string): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }

    /**
     * Récupère les statistiques d'un client
     */
    getClientStats(id: string): Observable<{
        nombreColis: number;
        colisEnCours: number;
        colisLivres: number;
    }> {
        return this.http.get<{
            nombreColis: number;
            colisEnCours: number;
            colisLivres: number;
        }>(`${this.API_URL}/${id}/stats`);
    }
}
