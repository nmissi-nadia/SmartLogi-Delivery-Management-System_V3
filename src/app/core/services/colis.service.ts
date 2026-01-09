import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { Destinataire } from './destinataire.service';
import type { Zone } from './zone.service';

export interface HistoriqueLivraison {
    id: string;
    colisId: string | null;
    statut: string;
    dateChangement: string;
    commentaire: string;
    statutLibelle: string | null;
}

export interface Colis {
    id: string;
    description: string;
    poids: number;
    priorite: 'HAUTE' | 'MOYENNE' | 'BASSE';
    villeDestination: string;
    statut: 'CREE' | 'COLLECTE' | 'EN_STOCK' | 'EN_TRANSIT' | 'LIVRE';
    livreurId: string | null;
    clientExpediteurId: string;
    destinataireId: string;
    zoneId: string | null;
    historique: HistoriqueLivraison[];
    dateCreation?: string | Date;
    dateModification?: string | Date;
}

export interface ClientExpediteurDTO {
    id?: string;
    nom?: string;
    prenom?: string;
    email?: string;
    telephone?: string;
    adresse?: string;
}

export interface DestinataireDTO {
    id?: string;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    adresse: string;
}

export interface ZoneDTO {
    id?: string;
    nom: string;
    codePostal: string;
}

export interface ColisProduitDTO {
    produit?: {
        id?: string;
        nom: string;
        categorie: string;
        poids: number;
        prix: number;
    };
    quantite: number;
}

export interface ColisRequestDTO {
    description: string;
    poids: number;
    priorite: 'HAUTE' | 'MOYENNE' | 'BASSE';
    villeDestination: string;
    clientExpediteur: ClientExpediteurDTO;
    destinataire: DestinataireDTO;
    zone?: ZoneDTO;
    produits: ColisProduitDTO[];
}

/**
 * Service pour gérer les colis
 */
@Injectable({
    providedIn: 'root'
})
export class ColisService {
    private readonly http = inject(HttpClient);
    private readonly API_URL = `${environment.apiUrl}/api/colis`;

    /**
     * Récupère la liste de tous les colis
     */
    getAllColis(): Observable<Colis[]> {
        return this.http.get<Colis[]>(this.API_URL);
    }

    /**
     * Récupère les colis d'un client spécifique
     * Utilise l'authentification JWT pour identifier le client
     */
    getColisByClient(clientId: string): Observable<Colis[]> {
        // Le backend utilise /api/clients/colis avec authentification JWT
        return this.http.get<any>(`${environment.apiUrl}/api/clients/colis`).pipe(
            map((response: any) => {
                // Le backend retourne une Page, on extrait le contenu
                return response.content || response;
            })
        );
    }

    /**
     * Récupère les colis d'un livreur spécifique
     */
    getColisByLivreur(livreurId: string): Observable<Colis[]> {
        return this.http.get<Colis[]>(`${this.API_URL}/livreur/${livreurId}`);
    }

    /**
     * Récupère un colis par son ID
     */
    getColisById(id: string): Observable<Colis> {
        return this.http.get<Colis>(`${this.API_URL}/${id}`);
    }

    /**
     * Crée un nouveau colis
     */
    createColis(colis: ColisRequestDTO): Observable<Colis> {
        return this.http.post<Colis>(`${environment.apiUrl}/api/clients/colis`, colis);
    }

    /**
     * Met à jour un colis existant
     */
    updateColis(id: string, colis: Partial<ColisRequestDTO>): Observable<Colis> {
        return this.http.put<Colis>(`${this.API_URL}/${id}`, colis);
    }

    /**
     * Supprime un colis
     */
    deleteColis(id: string): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }

    /**
     * Filtre les colis par statut
     */
    getColisByStatut(statut: string): Observable<Colis[]> {
        const params = new HttpParams().set('statut', statut);
        return this.http.get<Colis[]>(this.API_URL, { params });
    }

    /**
     * Assigne un livreur à un colis
     */
    assignerLivreur(colisId: string, livreurId: string): Observable<Colis> {
        return this.http.put<Colis>(`${this.API_URL}/${colisId}/assigner-livreur`, { livreurId });
    }

    /**
     * Met à jour le statut d'un colis
     */
    updateStatut(colisId: string, statut: string): Observable<Colis> {
        return this.http.put<Colis>(`${this.API_URL}/${colisId}/statut`, { statut });
    }
}
