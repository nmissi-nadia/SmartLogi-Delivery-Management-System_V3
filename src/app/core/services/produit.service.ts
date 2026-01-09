import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Produit {
    id: string;
    nom: string;
    categorie: string;
    poids: number;
    prix: number;
}

export interface CreateProduitDTO {
    nom: string;
    categorie: string;
    poids: number;
    prix: number;
}

/**
 * Service pour gérer les produits
 */
@Injectable({
    providedIn: 'root'
})
export class ProduitService {
    private readonly http = inject(HttpClient);
    private readonly API_URL = `${environment.apiUrl}/api/produits`;

    /**
     * Récupère la liste de tous les produits
     */
    getProduits(): Observable<Produit[]> {
        return this.http.get<Produit[]>(this.API_URL);
    }

    /**
     * Récupère un produit par son ID
     */
    getProduitById(id: string): Observable<Produit> {
        return this.http.get<Produit>(`${this.API_URL}/${id}`);
    }

    /**
     * Crée un nouveau produit
     */
    createProduit(produit: CreateProduitDTO): Observable<Produit> {
        return this.http.post<Produit>(this.API_URL, produit);
    }

    /**
     * Met à jour un produit existant
     */
    updateProduit(id: string, produit: Partial<CreateProduitDTO>): Observable<Produit> {
        return this.http.put<Produit>(`${this.API_URL}/${id}`, produit);
    }

    /**
     * Supprime un produit
     */
    deleteProduit(id: string): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }
}
