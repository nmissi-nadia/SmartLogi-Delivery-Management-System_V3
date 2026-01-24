import { Livreur } from '../../core/services/livreur.service';

/**
 * État de la gestion des livreurs
 */
export interface LivreursState {
    livreurs: Livreur[];
    selectedLivreur: Livreur | null;
    loading: boolean;
    error: string | null;
}

/**
 * État initial des livreurs
 */
export const initialLivreursState: LivreursState = {
    livreurs: [],
    selectedLivreur: null,
    loading: false,
    error: null
};
