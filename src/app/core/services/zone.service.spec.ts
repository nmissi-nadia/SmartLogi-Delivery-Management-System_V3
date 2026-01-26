import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ZoneService, Zone } from './zone.service';

/**
 * 1. 'describe' : C'est le bloc principal qui regroupe tous les tests d'un service ou d'un composant.
 * On lui donne un nom (ici 'ZoneService') pour que ce soit clair dans les résultats des tests.
 */
describe('ZoneService', () => {
    let service: ZoneService;
    let httpMock: HttpTestingController;

    /**
     * 2. 'beforeEach' : Ce bloc s'exécute AVANT CHAQUE test ('it').
     * C'est ici qu'on configure l'environnement de test (TestBed).
     */
    beforeEach(() => {
        TestBed.configureTestingModule({
            // On importe HttpClientTestingModule pour ne pas faire de vrais appels réseau
            imports: [HttpClientTestingModule],
            // On déclare le service qu'on veut tester
            providers: [ZoneService]
        });

        // On injecte les instances nécessaires
        service = TestBed.inject(ZoneService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    /**
     * 3. 'afterEach' : S'exécute APRES CHAQUE test.
     * Très important pour vérifier qu'il n'y a pas de requêtes HTTP non terminées.
     */
    afterEach(() => {
        httpMock.verify();
    });

    /**
     * 4. 'it' : C'est un test unitaire individuel.
     * La phrase passée en paramètre doit décrire ce que le test vérifie.
     */
    it('doit être créé (initialisation)', () => {
        // 5. 'expect' : C'est une affirmation (assertion). 
        // Si l'affirmation est fausse, le test échoue.
        expect(service).toBeTruthy();
    });

    /**
     * Test d'un appel API simple (GET)
     */
    it('doit récupérer la liste des zones via un appel GET', () => {
        // On définit des données fictives (Mocks) que le serveur est censé renvoyer
        const mockZones: Zone[] = [
            { id: '1', nom: 'Casablanca', codePostal: '20000' },
            { id: '2', nom: 'Rabat', codePostal: '10000' }
        ];

        // On appelle la méthode du service
        service.getZones().subscribe((zones) => {
            // On vérifie que les données reçues correspondent à nos mocks
            expect(zones.length).toBe(2);
            expect(zones).toEqual(mockZones);
        });

        // On intercepte l'appel HTTP (on simule le serveur)
        // Note: L'URL est récupérée dynamiquement dans le service, ici on vérifie l'URL attendue.
        const req = httpMock.expectOne('http://localhost:8084/api/zones');

        // On vérifie que la méthode HTTP utilisée est bien GET
        expect(req.request.method).toBe('GET');

        // On répond à la requête avec nos données fictives
        req.flush(mockZones);
    });

    /**
     * Test d'une création (POST)
     */
    it('doit créer une nouvelle zone via un appel POST', () => {
        const newZone = { nom: 'Marrakech', codePostal: '40000' };
        const mockResponse: Zone = { id: '3', ...newZone };

        service.createZone(newZone).subscribe((response) => {
            expect(response.id).toBe('3');
            expect(response.nom).toBe('Marrakech');
        });

        const req = httpMock.expectOne('http://localhost:8084/api/zones');
        expect(req.request.method).toBe('POST');

        // On vérifie que le service a envoyé les bonnes données au serveur
        expect(req.request.body).toEqual(newZone);

        // On simule la réponse du serveur
        req.flush(mockResponse);
    });
});
