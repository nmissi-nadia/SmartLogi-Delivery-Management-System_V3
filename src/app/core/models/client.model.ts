export interface ClientExpediteur {
    id: string;
    nom: string;
    prenom: string;
    email: string;
    telephone?: string;
    adresse?: string;
    userId?: string; // User association

    // Propriétés enrichies (ajoutées par le frontend ou backend)
    nombreColis?: number;
    colisEnCours?: number;
    colisLivres?: number;
    dateCreation?: string;
}

export interface CreateClientDTO {
    nom: string;
    prenom: string;
    email: string;
    telephone?: string;
    adresse?: string;
    userId?: string; // User association
}

export interface ClientPage {
    content: ClientExpediteur[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}
