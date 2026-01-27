import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ColisService, Colis, ColisRequestDTO } from './colis.service';
import { mockColis } from '../../../testing/mock-data';

describe('ColisService', () => {
    let service: ColisService;
    let httpMock: HttpTestingController;
    const API_URL = 'http://localhost:8084/api/colis';

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ColisService],
        });

        service = TestBed.inject(ColisService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getAllColis', () => {
        it('should retrieve all colis', (done) => {
            service.getAllColis().subscribe({
                next: (colis) => {
                    expect(colis.length).toBe(3);
                    expect(colis).toEqual(mockColis as any);
                    done();
                },
                error: done.fail,
            });

            const req = httpMock.expectOne(API_URL);
            expect(req.request.method).toBe('GET');
            req.flush(mockColis);
        });

        it('should handle error when retrieving colis', (done) => {
            service.getAllColis().subscribe({
                next: () => done.fail('Should have failed'),
                error: (error) => {
                    expect(error.status).toBe(500);
                    done();
                },
            });

            const req = httpMock.expectOne(API_URL);
            req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
        });
    });

    describe('getColisById', () => {
        it('should retrieve a specific colis by ID', (done) => {
            const colisId = 'COL-001';
            const expectedColis = mockColis[0];

            service.getColisById(colisId).subscribe({
                next: (colis) => {
                    expect(colis).toEqual(expectedColis as any);
                    done();
                },
                error: done.fail,
            });

            const req = httpMock.expectOne(`${API_URL}/${colisId}`);
            expect(req.request.method).toBe('GET');
            req.flush(expectedColis);
        });

        it('should handle 404 when colis not found', (done) => {
            const colisId = 'NON-EXISTENT';

            service.getColisById(colisId).subscribe({
                next: () => done.fail('Should have failed'),
                error: (error) => {
                    expect(error.status).toBe(404);
                    done();
                },
            });

            const req = httpMock.expectOne(`${API_URL}/${colisId}`);
            req.flush('Not found', { status: 404, statusText: 'Not Found' });
        });
    });

    describe('createColis', () => {
        it('should create a new colis', (done) => {
            const newColis: ColisRequestDTO = {
                description: 'Nouveau colis',
                poids: 4.5,
                priorite: 'HAUTE',
                villeDestination: 'Paris',
                clientExpediteur: {
                    nom: 'Dupont',
                    prenom: 'Jean',
                    email: 'jean@test.com',
                    telephone: '0123456789',
                    adresse: '123 Rue Test',
                },
                destinataire: {
                    nom: 'Martin',
                    prenom: 'Marie',
                    email: 'marie@test.com',
                    telephone: '0987654321',
                    adresse: '456 Avenue Test',
                },
                produits: [],
            };

            const createdColis = { ...newColis, id: 'COL-004', statut: 'CREE' };

            service.createColis(newColis).subscribe({
                next: (colis) => {
                    expect(colis.id).toBe('COL-004');
                    expect(colis.description).toBe('Nouveau colis');
                    done();
                },
                error: done.fail,
            });

            const req = httpMock.expectOne('http://localhost:8084/api/colis');
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(newColis);
            req.flush(createdColis);
        });
    });

    describe('updateColis', () => {
        it('should update an existing colis', (done) => {
            const colisId = 'COL-001';
            const updates: Partial<ColisRequestDTO> = {
                description: 'Description mise à jour',
                poids: 6.0,
            };

            const updatedColis = { ...mockColis[0], ...updates };

            service.updateColis(colisId, updates).subscribe({
                next: (colis) => {
                    expect(colis.description).toBe('Description mise à jour');
                    expect(colis.poids).toBe(6.0);
                    done();
                },
                error: done.fail,
            });

            const req = httpMock.expectOne(`${API_URL}/${colisId}`);
            expect(req.request.method).toBe('PUT');
            expect(req.request.body).toEqual(updates);
            req.flush(updatedColis);
        });
    });

    describe('deleteColis', () => {
        it('should delete a colis', (done) => {
            const colisId = 'COL-001';

            service.deleteColis(colisId).subscribe({
                next: () => {
                    expect().nothing();
                    done();
                },
                error: done.fail,
            });

            const req = httpMock.expectOne(`${API_URL}/${colisId}`);
            expect(req.request.method).toBe('DELETE');
            req.flush(null);
        });
    });

    describe('getColisByStatut', () => {
        it('should filter colis by status', (done) => {
            const statut = 'EN_TRANSIT';
            const filteredColis = mockColis.filter((c: any) => c.statut === statut);

            service.getColisByStatut(statut).subscribe({
                next: (colis) => {
                    expect(colis.length).toBe(1);
                    expect(colis[0].statut).toBe('EN_TRANSIT');
                    done();
                },
                error: done.fail,
            });

            const req = httpMock.expectOne((request) => {
                return request.url === API_URL && request.params.get('statut') === statut;
            });
            expect(req.request.method).toBe('GET');
            req.flush(filteredColis);
        });
    });

    describe('assignerLivreur', () => {
        it('should assign a livreur to a colis', (done) => {
            const colisId = 'COL-001';
            const livreurId = 'LIV-001';
            const updatedColis = { ...mockColis[0], livreurId };

            service.assignerLivreur(colisId, livreurId).subscribe({
                next: (colis) => {
                    expect(colis.livreurId).toBe(livreurId);
                    done();
                },
                error: done.fail,
            });

            const req = httpMock.expectOne(`${API_URL}/${colisId}/assigner-livreur`);
            expect(req.request.method).toBe('PUT');
            expect(req.request.body).toEqual({ livreurId });
            req.flush(updatedColis);
        });
    });

    describe('updateStatut', () => {
        it('should update colis status', (done) => {
            const colisId = 'COL-001';
            const nouveauStatut = 'LIVRE';
            const updatedColis = { ...mockColis[0], statut: nouveauStatut };

            service.updateStatut(colisId, nouveauStatut).subscribe({
                next: (colis) => {
                    expect(colis.statut).toBe('LIVRE');
                    done();
                },
                error: done.fail,
            });

            const req = httpMock.expectOne(
                `http://localhost:8084/api/livreurs/colis/${colisId}/statut?nouveauStatut=${nouveauStatut}`
            );
            expect(req.request.method).toBe('PUT');
            req.flush(updatedColis);
        });
    });

    describe('getColisByClient', () => {
        it('should retrieve colis for a client', (done) => {
            const clientId = 'CLI-001';
            const response = { content: mockColis };

            service.getColisByClient(clientId).subscribe({
                next: (colis) => {
                    expect(colis.length).toBe(3);
                    expect(colis).toEqual(mockColis as any);
                    done();
                },
                error: done.fail,
            });

            const req = httpMock.expectOne('http://localhost:8084/api/clients/colis');
            expect(req.request.method).toBe('GET');
            req.flush(response);
        });

        it('should handle response without content wrapper', (done) => {
            const clientId = 'CLI-001';

            service.getColisByClient(clientId).subscribe({
                next: (colis) => {
                    expect(colis).toEqual(mockColis as any);
                    done();
                },
                error: done.fail,
            });

            const req = httpMock.expectOne('http://localhost:8084/api/clients/colis');
            req.flush(mockColis);
        });
    });

    describe('getColisByLivreur', () => {
        it('should retrieve colis for a livreur', (done) => {
            service.getColisByLivreur().subscribe({
                next: (colis) => {
                    expect(colis).toEqual(mockColis as any);
                    done();
                },
                error: done.fail,
            });

            const req = httpMock.expectOne('http://localhost:8084/api/livreurs/colis');
            expect(req.request.method).toBe('GET');
            req.flush(mockColis);
        });
    });
});
