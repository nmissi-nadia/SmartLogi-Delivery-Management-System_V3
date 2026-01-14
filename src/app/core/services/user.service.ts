import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    enabled: boolean;
}

/**
 * Service pour gérer les utilisateurs
 */
@Injectable({
    providedIn: 'root'
})
export class UserService {
    private readonly http = inject(HttpClient);
    private readonly API_URL = `${environment.apiUrl}/api/users`;

    /**
     * Récupère la liste de tous les utilisateurs
     */
    getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.API_URL);
    }

    /**
     * Récupère un utilisateur par son ID
     */
    getUserById(id: string): Observable<User> {
        return this.http.get<User>(`${this.API_URL}/${id}`);
    }

    /**
     * Crée un nouvel utilisateur
     */
    createUser(user: Partial<User>): Observable<User> {
        return this.http.post<User>(this.API_URL, user);
    }

    /**
     * Met à jour un utilisateur existant
     */
    updateUser(id: string, user: Partial<User>): Observable<User> {
        return this.http.put<User>(`${this.API_URL}/${id}`, user);
    }

    /**
     * Supprime un utilisateur
     */
    deleteUser(id: string): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }
}
