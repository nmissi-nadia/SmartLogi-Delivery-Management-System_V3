import { TestBed } from '@angular/core/testing';
import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { of, firstValueFrom } from 'rxjs';
import { statsResolver } from './stats.resolver';
import { StatistiquesService, StatistiquesOverview } from '../services/statistiques.service';

describe('statsResolver', () => {
    let statistiquesService: jasmine.SpyObj<StatistiquesService>;
    let mockRoute: ActivatedRouteSnapshot;
    let mockState: RouterStateSnapshot;

    beforeEach(() => {
        const serviceSpy = jasmine.createSpyObj('StatistiquesService', ['getStatistiquesOverview']);

        TestBed.configureTestingModule({
            providers: [
                { provide: StatistiquesService, useValue: serviceSpy }
            ]
        });

        statistiquesService = TestBed.inject(StatistiquesService) as jasmine.SpyObj<StatistiquesService>;
        mockRoute = {} as ActivatedRouteSnapshot;
        mockState = {} as RouterStateSnapshot;
    });

    it('should resolve statistics overview', async () => {
        // Arrange
        const mockStats: StatistiquesOverview = {
            totalColis: 100,
            colisEnAttente: 10,
            colisEnCours: 25,
            colisLivres: 70
        };
        statistiquesService.getStatistiquesOverview.and.returnValue(of(mockStats));

        // Act & Assert
        await TestBed.runInInjectionContext(async () => {
            const result = statsResolver(mockRoute, mockState);
            const stats = await firstValueFrom(result as any);
            expect(stats).toEqual(mockStats);
            expect(statistiquesService.getStatistiquesOverview).toHaveBeenCalled();
        });
    });
});
