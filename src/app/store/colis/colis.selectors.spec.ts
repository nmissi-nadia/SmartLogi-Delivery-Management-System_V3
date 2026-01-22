import { selectColisState, selectAllColis, selectColisLoading, selectColisError, selectSelectedColis, selectColisFilters, selectFilteredColis, selectColisCountByStatut } from './colis.selectors';
import { ColisState } from './colis.state';

describe('Colis Selectors', () => {
    const mockColis = [
        {
            id: 'COL-001',
            description: 'Colis 1',
            poids: 5,
            hauteur: 10,
            largeur: 10,
            longueur: 10,
            statut: 'CREE' as const,
            priorite: 'HAUTE' as const,
            villeDestination: 'Paris',
            livreurId: null,
            clientExpediteurId: 'CLI-001',
            destinataireId: 'DEST-001',
            zoneId: null,
            historique: [],
        },
        {
            id: 'COL-002',
            description: 'Colis 2',
            poids: 3,
            hauteur: 15,
            largeur: 10,
            longueur: 20,
            statut: 'EN_TRANSIT' as const,
            priorite: 'MOYENNE' as const,
            villeDestination: 'Lyon',
            livreurId: 'LIV-001',
            clientExpediteurId: 'CLI-001',
            destinataireId: 'DEST-002',
            zoneId: 'ZONE-001',
            historique: [],
        },
        {
            id: 'COL-003',
            description: 'Colis 3',
            poids: 2,
            hauteur: 10,
            largeur: 10,
            longueur: 15,
            statut: 'LIVRE' as const,
            priorite: 'BASSE' as const,
            villeDestination: 'Marseille',
            livreurId: 'LIV-002',
            clientExpediteurId: 'CLI-002',
            destinataireId: 'DEST-003',
            zoneId: 'ZONE-002',
            historique: [],
        },
        {
            id: 'COL-004',
            description: 'Colis 4',
            poids: 4,
            hauteur: 12,
            largeur: 12,
            longueur: 18,
            statut: 'COLLECTE' as const,
            priorite: 'HAUTE' as const,
            villeDestination: 'Toulouse',
            livreurId: null,
            clientExpediteurId: 'CLI-001',
            destinataireId: 'DEST-004',
            zoneId: null,
            historique: [],
        },
    ];

    const initialState: ColisState = {
        colis: mockColis,
        selectedColis: null,
        loading: false,
        error: null,
        filters: {
            statut: 'tous',
            recherche: '',
        },
    };

    describe('selectColisState', () => {
        it('should select the colis state', () => {
            const result = selectColisState.projector(initialState);
            expect(result).toEqual(initialState);
        });
    });

    describe('selectAllColis', () => {
        it('should select all colis', () => {
            const result = selectAllColis.projector(initialState);
            expect(result).toEqual(mockColis);
            expect(result.length).toBe(4);
        });
    });

    describe('selectColisLoading', () => {
        it('should select loading state as false', () => {
            const result = selectColisLoading.projector(initialState);
            expect(result).toBe(false);
        });

        it('should select loading state as true', () => {
            const loadingState = { ...initialState, loading: true };
            const result = selectColisLoading.projector(loadingState);
            expect(result).toBe(true);
        });
    });

    describe('selectColisError', () => {
        it('should select error as null', () => {
            const result = selectColisError.projector(initialState);
            expect(result).toBeNull();
        });

        it('should select error message', () => {
            const errorState = { ...initialState, error: 'Error loading colis' };
            const result = selectColisError.projector(errorState);
            expect(result).toBe('Error loading colis');
        });
    });

    describe('selectSelectedColis', () => {
        it('should select null when no colis is selected', () => {
            const result = selectSelectedColis.projector(initialState);
            expect(result).toBeNull();
        });

        it('should select the selected colis', () => {
            const stateWithSelection = { ...initialState, selectedColis: mockColis[0] };
            const result = selectSelectedColis.projector(stateWithSelection);
            expect(result).toEqual(mockColis[0]);
        });
    });

    describe('selectColisFilters', () => {
        it('should select the filters', () => {
            const result = selectColisFilters.projector(initialState);
            expect(result).toEqual({
                statut: 'tous',
                recherche: '',
            });
        });
    });

    describe('selectFilteredColis', () => {
        it('should return all colis when no filters are applied', () => {
            const filters = { statut: 'tous', recherche: '' };
            const result = selectFilteredColis.projector(mockColis, filters);
            expect(result.length).toBe(4);
        });

        it('should filter colis by status', () => {
            const filters = { statut: 'EN_TRANSIT', recherche: '' };
            const result = selectFilteredColis.projector(mockColis, filters);
            expect(result.length).toBe(1);
            expect(result[0].statut).toBe('EN_TRANSIT');
        });

        it('should filter colis by search term in description', () => {
            const filters = { statut: 'tous', recherche: 'colis 2' };
            const result = selectFilteredColis.projector(mockColis, filters);
            expect(result.length).toBe(1);
            expect(result[0].description).toBe('Colis 2');
        });

        it('should filter colis by search term in ID', () => {
            const filters = { statut: 'tous', recherche: 'COL-003' };
            const result = selectFilteredColis.projector(mockColis, filters);
            expect(result.length).toBe(1);
            expect(result[0].id).toBe('COL-003');
        });

        it('should apply both status and search filters', () => {
            const filters = { statut: 'CREE', recherche: 'colis' };
            const result = selectFilteredColis.projector(mockColis, filters);
            expect(result.length).toBe(1);
            expect(result[0].statut).toBe('CREE');
        });

        it('should be case-insensitive for search', () => {
            const filters = { statut: 'tous', recherche: 'COLIS 1' };
            const result = selectFilteredColis.projector(mockColis, filters);
            expect(result.length).toBe(1);
        });

        it('should return empty array when no colis match filters', () => {
            const filters = { statut: 'EN_STOCK', recherche: '' };
            const result = selectFilteredColis.projector(mockColis, filters);
            expect(result.length).toBe(0);
        });
    });

    describe('selectColisCountByStatut', () => {
        it('should count colis by status', () => {
            const result = selectColisCountByStatut.projector(mockColis);
            expect(result.total).toBe(4);
            expect(result.cree).toBe(1);
            expect(result.collecte).toBe(1);
            expect(result.enTransit).toBe(1);
            expect(result.livre).toBe(1);
        });

        it('should return zero counts for empty colis array', () => {
            const result = selectColisCountByStatut.projector([]);
            expect(result.total).toBe(0);
            expect(result.cree).toBe(0);
            expect(result.collecte).toBe(0);
            expect(result.enTransit).toBe(0);
            expect(result.livre).toBe(0);
        });

        it('should count only specific status', () => {
            const colisWithSameStatus = [mockColis[0], mockColis[0], mockColis[0]];
            const result = selectColisCountByStatut.projector(colisWithSameStatus);
            expect(result.total).toBe(3);
            expect(result.cree).toBe(3);
            expect(result.collecte).toBe(0);
            expect(result.enTransit).toBe(0);
            expect(result.livre).toBe(0);
        });
    });
});
