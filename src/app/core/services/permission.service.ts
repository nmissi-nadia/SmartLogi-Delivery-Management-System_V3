import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Permission {
    id: string;
    name: string;
}

export interface CreatePermissionDTO {
    name: string;
}

/**
 * Service pour gérer les permissions
 */
@Injectable({
    providedIn: 'root'
})
export class PermissionService {
    private readonly http = inject(HttpClient);
    private readonly API_URL = `${environment.apiUrl}/api/permissions`;

    /**
     * Récupère la liste de toutes les permissions
     */
    getAllPermissions(): Observable<Permission[]> {
        return this.http.get<Permission[]>(this.API_URL);
    }

    /**
     * Crée une nouvelle permission
     */
    createPermission(permission: CreatePermissionDTO): Observable<Permission> {
        return this.http.post<Permission>(this.API_URL, permission);
    }

    /**
     * Supprime une permission
     */
    deletePermission(id: string): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }
}
