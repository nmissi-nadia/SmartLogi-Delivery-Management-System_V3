export interface ClientExpediteur {
    id: string;
    username: string;
    nom: string;
    prenom: string;
    email: string;
    telephone?: string;
    adresse?: string;
    ville?: string;
    codePostal?: string;

    // Propriétés enrichies (ajoutées par le frontend ou backend)
    nombreColis?: number;
    colisEnCours?: number;
    colisLivres?: number;
    dateCreation?: string;
}

export interface CreateClientDTO {
    username: string;
    nom: string;
    prenom: string;
    email: string;
    telephone?: string;
    adresse?: string;
    ville?: string;
    codePostal?: string;
}

export interface ClientPage {
    content: ClientExpediteur[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}
