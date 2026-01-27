/**
 * État des filtres globaux
 * Centralise tous les filtres utilisés dans l'application
 */
export interface FiltersState {
    statut: string | null;
    dateDebut: string | null;
    dateFin: string | null;
    zoneId: string | null;
    livreurId: string | null;
    searchTerm: string | null;
    priorite: string | null;
}

/**
 * État initial des filtres
 */
export const initialFiltersState: FiltersState = {
    statut: null,
    dateDebut: null,
    dateFin: null,
    zoneId: null,
    livreurId: null,
    searchTerm: null,
    priorite: null
};
