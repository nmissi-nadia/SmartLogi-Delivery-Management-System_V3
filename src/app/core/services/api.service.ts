import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Service de base pour les appels API
 * Fournit des méthodes utilitaires pour les requêtes HTTP
 */
@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private readonly http = inject(HttpClient);
    protected readonly API_URL = environment.apiUrl;

    /**
     * Effectue une requête GET
     * @param endpoint - L'endpoint de l'API (ex: '/colis')
     * @param params - Paramètres de requête optionnels
     * @returns Observable de la réponse
     */
    get<T>(endpoint: string, params?: HttpParams): Observable<T> {
        return this.http.get<T>(`${this.API_URL}${endpoint}`, { params });
    }

    /**
     * Effectue une requête POST
     * @param endpoint - L'endpoint de l'API
     * @param body - Le corps de la requête
     * @returns Observable de la réponse
     */
    post<T>(endpoint: string, body: any): Observable<T> {
        return this.http.post<T>(`${this.API_URL}${endpoint}`, body);
    }

    /**
     * Effectue une requête PUT
     * @param endpoint - L'endpoint de l'API
     * @param body - Le corps de la requête
     * @returns Observable de la réponse
     */
    put<T>(endpoint: string, body: any): Observable<T> {
        return this.http.put<T>(`${this.API_URL}${endpoint}`, body);
    }

    /**
     * Effectue une requête PATCH
     * @param endpoint - L'endpoint de l'API
     * @param body - Le corps de la requête
     * @returns Observable de la réponse
     */
    patch<T>(endpoint: string, body: any): Observable<T> {
        return this.http.patch<T>(`${this.API_URL}${endpoint}`, body);
    }

    /**
     * Effectue une requête DELETE
     * @param endpoint - L'endpoint de l'API
     * @returns Observable de la réponse
     */
    delete<T>(endpoint: string): Observable<T> {
        return this.http.delete<T>(`${this.API_URL}${endpoint}`);
    }

    /**
     * Construit des HttpParams à partir d'un objet
     * @param params - Objet contenant les paramètres
     * @returns HttpParams
     */
    buildParams(params: { [key: string]: any }): HttpParams {
        let httpParams = new HttpParams();

        Object.keys(params).forEach(key => {
            if (params[key] !== null && params[key] !== undefined) {
                httpParams = httpParams.set(key, params[key].toString());
            }
        });

        return httpParams;
    }
}
