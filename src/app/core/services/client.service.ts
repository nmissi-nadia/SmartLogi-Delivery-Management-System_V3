import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { ClientExpediteur, ClientPage, CreateClientDTO } from '../models/client.model';

/**
 * Service pour la gestion des clients expéditeurs
 */
@Injectable({
    providedIn: 'root'
})
export class ClientService {
    private readonly http = inject(HttpClient);
    private readonly API_URL = `${environment.apiUrl}/api/clients`;

    /**
     * Récupère tous les clients
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
     * Crée un nouveau client
     */
    createClient(client: CreateClientDTO): Observable<ClientExpediteur> {
        return this.http.post<ClientExpediteur>(this.API_URL, client);
    }

    /**
     * Met à jour un client existant
     */
    updateClient(id: string, client: Partial<ClientExpediteur>): Observable<ClientExpediteur> {
        return this.http.put<ClientExpediteur>(`${this.API_URL}/${id}`, client);
    }

    /**
     * Supprime un client
     */
    deleteClient(id: string): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }

    /**
     * Recherche des clients par mot-clé avec pagination
     */
    searchClients(keyword: string, page: number = 0, size: number = 20): Observable<ClientPage> {
        let params = new HttpParams()
            .set('keyword', keyword)
            .set('page', page.toString())
            .set('size', size.toString());

        return this.http.get<ClientPage>(`${this.API_URL}/search`, { params });
    }
}
