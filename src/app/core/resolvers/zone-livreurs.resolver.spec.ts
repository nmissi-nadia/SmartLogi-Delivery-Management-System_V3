import { TestBed } from '@angular/core/testing';
import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { zoneLivreursResolver } from './zone-livreurs.resolver';
import { AppState } from '../../store';

describe('zoneLivreursResolver', () => {
    let store: jasmine.SpyObj<Store<AppState>>;
    let mockRoute: ActivatedRouteSnapshot;
    let mockState: RouterStateSnapshot;

    beforeEach(() => {
        const storeSpy = jasmine.createSpyObj('Store', ['select', 'dispatch']);

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

    it('should resolve livreurs for a zone', (done) => {
        // Arrange
        const zoneId = '5';
        const mockLivreurs = [
            { id: '1', nom: 'Livreur1', prenom: 'Test1', telephone: '123', zoneId: '5' },
            { id: '2', nom: 'Livreur2', prenom: 'Test2', telephone: '456', zoneId: '5' }
        ];
        (mockRoute.paramMap.get as jasmine.Spy).and.returnValue(zoneId);
        store.select.and.returnValue(of(mockLivreurs));

        // Act
        TestBed.runInInjectionContext(() => {
            const result$ = zoneLivreursResolver(mockRoute, mockState);

            // Assert
            expect(store.dispatch).toHaveBeenCalled();
            result$?.subscribe((livreurs: any) => {
                expect(livreurs).toEqual(mockLivreurs);
                done();
            });
        });
    });

    it('should return empty array when no zone id is provided', () => {
        // Arrange
        (mockRoute.paramMap.get as jasmine.Spy).and.returnValue(null);

        // Act
        const result = TestBed.runInInjectionContext(() => {
            return zoneLivreursResolver(mockRoute, mockState);
        });

        // Assert
        expect(result).toEqual([]);
        expect(store.dispatch).not.toHaveBeenCalled();
    });
});
