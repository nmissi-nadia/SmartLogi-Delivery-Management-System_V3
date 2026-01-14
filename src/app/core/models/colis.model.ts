export interface Colis {
    id: string;
    description: string;
    poids: number;
    priorite: 'HAUTE' | 'MOYENNE' | 'BASSE';
    villeDestination: string;
    statut: 'EN_ATTENTE' | 'EN_COURS' | 'LIVRE' | 'RETOURNE' | 'ANNULE';
    livreurId?: string;
    clientExpediteurId: string;
    destinataireId: string;
    zoneId?: string;
    historique?: HistoriqueLivraison[];

    // Propriétés enrichies (ajoutées par le backend ou frontend)
    livreurNom?: string;
    clientNom?: string;
    destinataireNom?: string;
    zoneNom?: string;
    numeroColis?: string;
    dateCreation?: string;
    dateLivraisonPrevue?: string;
}

export interface HistoriqueLivraison {
    id: string;
    colisId: string;
    statut: string;
    dateChangement: string;
    commentaire?: string;
    statutLibelle?: string;
}

export interface CreateColisDTO {
    description: string;
    poids: number;
    priorite: 'HAUTE' | 'MOYENNE' | 'BASSE';
    villeDestination: string;
    clientExpediteurId: string;
    destinataireId: string;
    zoneId?: string;
}
