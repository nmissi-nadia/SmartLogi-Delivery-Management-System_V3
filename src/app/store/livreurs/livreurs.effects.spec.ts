import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { LivreursEffects } from './livreurs.effects';
import { LivreurService } from '../../core/services/livreur.service';
import * as LivreursActions from './livreurs.actions';
import { Action } from '@ngrx/store';

/**
 * Tests unitaires pour LivreursEffects
 */
describe('LivreursEffects', () => {
    let actions$: Observable<Action>;
    let effects: LivreursEffects;
    let livreurService: jasmine.SpyObj<LivreurService>;

    beforeEach(() => {
        const serviceSpy = jasmine.createSpyObj('LivreurService', ['getAllLivreurs', 'createLivreur', 'updateLivreur', 'deleteLivreur']);

        TestBed.configureTestingModule({
            providers: [
                LivreursEffects,
                provideMockActions(() => actions$),
                { provide: LivreurService, useValue: serviceSpy }
            ]
        });

        effects = TestBed.inject(LivreursEffects);
        livreurService = TestBed.inject(LivreurService) as jasmine.SpyObj<LivreurService>;
    });

    describe('loadLivreurs$', () => {
        it('should return loadLivreursSuccess on success', (done) => {
            const mockLivreurs = [{ id: '1', nom: 'L1' } as any];
            livreurService.getAllLivreurs.and.returnValue(of(mockLivreurs));
            actions$ = of(LivreursActions.loadLivreurs());

            effects.loadLivreurs$.subscribe(action => {
                expect(action).toEqual(LivreursActions.loadLivreursSuccess({ livreurs: mockLivreurs }));
                done();
            });
        });

        it('should return loadLivreursFailure on error', (done) => {
            livreurService.getAllLivreurs.and.returnValue(throwError(() => ({ message: 'Error' })));
            actions$ = of(LivreursActions.loadLivreurs());

            effects.loadLivreurs$.subscribe(action => {
                expect(action).toEqual(LivreursActions.loadLivreursFailure({ error: 'Error' }));
                done();
            });
        });
    });

    describe('createLivreur$', () => {
        it('should return createLivreurSuccess on success', (done) => {
            const livreurData = { nom: 'New' } as any;
            const createdLivreur = { id: '1', ...livreurData };
            livreurService.createLivreur.and.returnValue(of(createdLivreur));
            actions$ = of(LivreursActions.createLivreur({ livreur: livreurData }));

            effects.createLivreur$.subscribe(action => {
                expect(action).toEqual(LivreursActions.createLivreurSuccess({ livreur: createdLivreur }));
                done();
            });
        });
    });
});
