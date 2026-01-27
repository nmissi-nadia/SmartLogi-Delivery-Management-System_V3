import { colisReducer } from './colis.reducer';
import { initialColisState } from './colis.state';
import * as ColisActions from './colis.actions';
import { Colis } from '../../core/services/colis.service';

/**
 * Tests unitaires pour colisReducer
 */
describe('ColisReducer', () => {
    const mockColis: Colis[] = [
        { id: '1', description: 'Test 1', statut: 'CREE' } as any,
        { id: '2', description: 'Test 2', statut: 'LIVRE' } as any
    ];

    it('should return initial state', () => {
        const action = { type: 'Unknown' } as any;
        const state = colisReducer(initialColisState, action);
        expect(state).toBe(initialColisState);
    });

    it('should set loading on loadColis action', () => {
        const action = ColisActions.loadColis();
        const state = colisReducer(initialColisState, action);
        expect(state.loading).toBeTrue();
    });

    it('should load colis on loadColisSuccess action', () => {
        const action = ColisActions.loadColisSuccess({ colis: mockColis });
        const state = colisReducer(initialColisState, action);
        expect(state.colis).toEqual(mockColis);
        expect(state.loading).toBeFalse();
    });

    it('should set error on loadColisFailure action', () => {
        const action = ColisActions.loadColisFailure({ error: 'Server error' });
        const state = colisReducer(initialColisState, action);
        expect(state.error).toBe('Server error');
        expect(state.loading).toBeFalse();
    });

    it('should update filters on setColisStatutFilter action', () => {
        const action = ColisActions.setColisStatutFilter({ statut: 'EN_TRANSIT' });
        const state = colisReducer(initialColisState, action);
        expect(state.filters.statut).toBe('EN_TRANSIT');
    });
});
