import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Role {
    id: string;
    name: string;
    permissions?: Permission[];
}

export interface Permission {
    id: string;
    name: string;
}

/**
 * Service pour gérer les rôles
 */
@Injectable({
    providedIn: 'root'
})
export class RoleService {
    private readonly http = inject(HttpClient);
    private readonly API_URL = `${environment.apiUrl}/api/roles`;

    /**
     * Récupère la liste de tous les rôles
     */
    getAllRoles(): Observable<Role[]> {
        return this.http.get<Role[]>(this.API_URL);
    }

    /**
     * Assigne une permission à un rôle
     */
    assignPermissionToRole(roleId: string, permissionId: string): Observable<void> {
        return this.http.post<void>(`${this.API_URL}/${roleId}/permissions/${permissionId}`, {});
    }

    /**
     * Révoque une permission d'un rôle
     */
    revokePermissionFromRole(roleId: string, permissionId: string): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${roleId}/permissions/${permissionId}`);
    }
}
