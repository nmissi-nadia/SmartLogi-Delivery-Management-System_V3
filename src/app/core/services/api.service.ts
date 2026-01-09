import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Service API générique pour les requêtes HTTP
 */
@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private readonly http = inject(HttpClient);
    private readonly API_URL = environment.apiUrl;

    /**
     * Effectue une requête GET
     */
    get<T>(endpoint: string, params?: HttpParams): Observable<T> {
        return this.http.get<T>(`${this.API_URL}${endpoint}`, { params });
    }

    /**
     * Effectue une requête POST
     */
    post<T>(endpoint: string, body: any): Observable<T> {
        return this.http.post<T>(`${this.API_URL}${endpoint}`, body);
    }

    /**
     * Effectue une requête PUT
     */
    put<T>(endpoint: string, body: any): Observable<T> {
        return this.http.put<T>(`${this.API_URL}${endpoint}`, body);
    }

    /**
     * Effectue une requête DELETE
     */
    delete<T>(endpoint: string): Observable<T> {
        return this.http.delete<T>(`${this.API_URL}${endpoint}`);
    }

    /**
     * Effectue une requête PATCH
     */
    patch<T>(endpoint: string, body: any): Observable<T> {
        return this.http.patch<T>(`${this.API_URL}${endpoint}`, body);
    }
}
