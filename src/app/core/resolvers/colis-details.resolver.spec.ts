import { TestBed } from '@angular/core/testing';
import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { colisDetailsResolver } from './colis-details.resolver';
import { AppState } from '../../store';
import * as ColisActions from '../../store/colis/colis.actions';

describe('colisDetailsResolver', () => {
    let store: jasmine.SpyObj<Store<AppState>>;
    let mockRoute: ActivatedRouteSnapshot;
    let mockState: RouterStateSnapshot;

    beforeEach(() => {
        const storeSpy = jasmine.createSpyObj('Store', ['dispatch', 'select']);

        TestBed.configureTestingModule({
            providers: [
                { provide: Store, useValue: storeSpy }
            ]
        });

        store = TestBed.inject(Store) as jasmine.SpyObj<Store<AppState>>;

        mockRoute = {
            paramMap: {
                get: jasmine.createSpy('get')
            }
        } as any;

        mockState = {} as RouterStateSnapshot;
    });

    it('should load colis details when id is provided', (done) => {
        // Arrange
        const colisId = '123';
        const mockColis = { id: colisId, numeroSuivi: 'COL123', statut: 'EN_ATTENTE' };
        (mockRoute.paramMap.get as jasmine.Spy).and.returnValue(colisId);
        store.select.and.returnValue(of(mockColis));

        // Act
        TestBed.runInInjectionContext(() => {
            const result$ = colisDetailsResolver(mockRoute, mockState);

            // Assert
            expect(store.dispatch).toHaveBeenCalledWith(
                ColisActions.loadColisById({ colisId })
            );

            result$?.subscribe((colis: any) => {
                expect(colis).toEqual(mockColis);
                done();
            });
        });
    });

    it('should return null when no id is provided', () => {
        // Arrange
        (mockRoute.paramMap.get as jasmine.Spy).and.returnValue(null);

        // Act
        const result = TestBed.runInInjectionContext(() => {
            return colisDetailsResolver(mockRoute, mockState);
        });

        // Assert
        expect(result).toBeNull();
        expect(store.dispatch).not.toHaveBeenCalled();
    });
});
