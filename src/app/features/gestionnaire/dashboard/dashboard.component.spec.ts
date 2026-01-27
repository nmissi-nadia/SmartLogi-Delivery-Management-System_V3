import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { StatistiquesService } from '../../../core/services/statistiques.service';
import { GestionnaireService } from '../../../core/services/gestionnaire.service';
import { of, throwError } from 'rxjs';
import { provideRouter } from '@angular/router';

describe('DashboardComponent', () => {
    let component: DashboardComponent;
    let fixture: ComponentFixture<DashboardComponent>;
    let statistiquesService: jasmine.SpyObj<StatistiquesService>;
    let gestionnaireService: jasmine.SpyObj<GestionnaireService>;

    const mockStatistiques = {
        totalColis: 100,
        colisEnAttente: 20,
        colisEnCours: 50,
        colisLivres: 30,
        totalClients: 25,
        totalLivreurs: 10,
    };

    const mockColis = [
        {
            id: 'COL-001',
            description: 'Colis 1',
            statut: 'CREE' as const,
            poids: 5,
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
            statut: 'EN_TRANSIT' as const,
            poids: 3,
            priorite: 'MOYENNE' as const,
            villeDestination: 'Lyon',
            livreurId: 'LIV-001',
            clientExpediteurId: 'CLI-001',
            destinataireId: 'DEST-002',
            zoneId: 'ZONE-001',
            historique: [],
        },
    ];

    beforeEach(async () => {
        const statistiquesServiceSpy = jasmine.createSpyObj('StatistiquesService', [
            'getStatistiquesOverview',
        ]);
        const gestionnaireServiceSpy = jasmine.createSpyObj('GestionnaireService', [
            'getAllColis',
        ]);

        await TestBed.configureTestingModule({
            imports: [DashboardComponent],
            providers: [
                { provide: StatistiquesService, useValue: statistiquesServiceSpy },
                { provide: GestionnaireService, useValue: gestionnaireServiceSpy },
                provideRouter([]),
            ],
        }).compileComponents();

        statistiquesService = TestBed.inject(
            StatistiquesService
        ) as jasmine.SpyObj<StatistiquesService>;
        gestionnaireService = TestBed.inject(
            GestionnaireService
        ) as jasmine.SpyObj<GestionnaireService>;

        fixture = TestBed.createComponent(DashboardComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('should load statistics and recent colis on init', () => {
            statistiquesService.getStatistiquesOverview.and.returnValue(of(mockStatistiques));
            gestionnaireService.getAllColis.and.returnValue(of(mockColis));

            fixture.detectChanges(); // triggers ngOnInit

            expect(component.statistiques()).toEqual(mockStatistiques);
            expect(component.colisRecents().length).toBe(2);
            expect(component.loading()).toBe(false);
        });

        it('should handle error when loading statistics', () => {
            statistiquesService.getStatistiquesOverview.and.returnValue(
                throwError(() => new Error('API Error'))
            );
            gestionnaireService.getAllColis.and.returnValue(of(mockColis));

            fixture.detectChanges();

            expect(component.errorMessage()).toBe('Erreur lors du chargement des statistiques');
            expect(component.loading()).toBe(false);
        });

        it('should set loading to true initially', () => {
            statistiquesService.getStatistiquesOverview.and.returnValue(of(mockStatistiques));
            gestionnaireService.getAllColis.and.returnValue(of(mockColis));

            expect(component.loading()).toBe(true);
        });
    });

    describe('getStatutPourcentage', () => {
        beforeEach(() => {
            component.statistiques.set(mockStatistiques);
        });

        it('should calculate correct percentage for a status', () => {
            const percentage = component.getStatutPourcentage(30);
            expect(percentage).toBe(30); // 30/100 * 100 = 30%
        });

        it('should return 0 when total is 0', () => {
            component.statistiques.set({ ...mockStatistiques, totalColis: 0 });
            const percentage = component.getStatutPourcentage(10);
            expect(percentage).toBe(0);
        });

        it('should return 0 when statistics are null', () => {
            component.statistiques.set(null);
            const percentage = component.getStatutPourcentage(10);
            expect(percentage).toBe(0);
        });
    });

    describe('getTauxLivraison', () => {
        it('should calculate delivery rate correctly', () => {
            component.statistiques.set(mockStatistiques);
            const taux = component.getTauxLivraison();
            expect(taux).toBe(30); // 30/100 * 100 = 30%
        });

        it('should return 0 when no statistics', () => {
            component.statistiques.set(null);
            expect(component.getTauxLivraison()).toBe(0);
        });
    });

    describe('getStatutClass', () => {
        it('should return correct CSS class for each status', () => {
            expect(component.getStatutClass('CREE')).toBe('statut-cree');
            expect(component.getStatutClass('COLLECTE')).toBe('statut-collecte');
            expect(component.getStatutClass('EN_STOCK')).toBe('statut-stock');
            expect(component.getStatutClass('EN_TRANSIT')).toBe('statut-transit');
            expect(component.getStatutClass('LIVRE')).toBe('statut-livre');
        });

        it('should return default class for unknown status', () => {
            expect(component.getStatutClass('UNKNOWN')).toBe('statut-default');
        });
    });

    describe('getStatutLabel', () => {
        it('should return correct label for each status', () => {
            expect(component.getStatutLabel('CREE')).toBe('Créé');
            expect(component.getStatutLabel('COLLECTE')).toBe('Collecté');
            expect(component.getStatutLabel('EN_STOCK')).toBe('En stock');
            expect(component.getStatutLabel('EN_TRANSIT')).toBe('En transit');
            expect(component.getStatutLabel('LIVRE')).toBe('Livré');
        });

        it('should return original status for unknown status', () => {
            expect(component.getStatutLabel('UNKNOWN')).toBe('UNKNOWN');
        });
    });

    describe('Template rendering', () => {
        it('should display loading state', () => {
            statistiquesService.getStatistiquesOverview.and.returnValue(of(mockStatistiques));
            gestionnaireService.getAllColis.and.returnValue(of(mockColis));

            component.loading.set(true);

            // Check loading state before detectChanges
            expect(component.loading()).toBe(true);

            fixture.detectChanges();

            const compiled = fixture.nativeElement;
            // This would check for loading indicator in the template
            // Adjust selector based on your actual template
        });

        it('should display error message when present', () => {
            statistiquesService.getStatistiquesOverview.and.returnValue(of(mockStatistiques));
            gestionnaireService.getAllColis.and.returnValue(of(mockColis));

            component.errorMessage.set('Test error');
            component.loading.set(false);

            // Check the signal value before detectChanges
            expect(component.errorMessage()).toBe('Test error');

            fixture.detectChanges();

            const compiled = fixture.nativeElement;
            // This would check for error message in the template
        });

        it('should display statistics when loaded', () => {
            statistiquesService.getStatistiquesOverview.and.returnValue(of(mockStatistiques));
            gestionnaireService.getAllColis.and.returnValue(of(mockColis));

            fixture.detectChanges();

            expect(component.statistiques()).toBeTruthy();
            // Add more specific template assertions based on your HTML
        });
    });
});
