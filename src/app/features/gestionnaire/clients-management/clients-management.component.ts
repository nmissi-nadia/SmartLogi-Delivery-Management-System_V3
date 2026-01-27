import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ClientService } from '../../../core/services/client.service';
import type { ClientExpediteur } from '../../../core/models/client.model';
import { UserService, type User } from '../../../core/services/user.service';
import { GestionnaireColisService } from '../../../core/services/gestionnaire-colis.service';
import { debounceTime, Subject, forkJoin } from 'rxjs';

/**
 * Composant pour gérer les clients (Gestionnaire)
 */
@Component({
  selector: 'app-clients-management',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './clients-management.component.html',
  styleUrl: './clients-management.component.css'
})
export class ClientsManagementComponent implements OnInit {
  private readonly clientService = inject(ClientService);
  private readonly userService = inject(UserService);
  private readonly colisService = inject(GestionnaireColisService);

  // Données
  clients = signal<ClientExpediteur[]>([]);
  users = signal<User[]>([]);

  // Pagination
  currentPage = signal(0);
  pageSize = signal(20);
  totalElements = signal(0);
  totalPages = signal(0);

  // États
  loading = signal(true);
  errorMessage = signal<string | null>(null);

  // Recherche
  searchKeyword = signal('');
  private searchSubject = new Subject<string>();

  // Modals
  showModal = signal(false);
  showColisModal = signal(false);
  isEditMode = signal(false);
  currentClient = signal<ClientExpediteur | null>(null);

  // Formulaire
  formData = signal({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    userId: ''
  });

  ngOnInit(): void {
    this.chargerClients();
    this.chargerUtilisateurs();
    this.setupSearch();
  }

  /**
   * Charge tous les utilisateurs
   */
  private chargerUtilisateurs(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users.set(users);
      },
      error: (error: any) => {
        console.error('Erreur chargement utilisateurs:', error);
      }
    });
  }

  /**
   * Configuration de la recherche avec debounce
   */
  private setupSearch(): void {
    this.searchSubject.pipe(
      debounceTime(300)
    ).subscribe(keyword => {
      if (keyword.trim()) {
        this.rechercherClients(keyword);
      } else {
        this.chargerClients();
      }
    });
  }

  /**
   * Charge tous les clients
   */
  chargerClients(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    forkJoin({
      clients: this.clientService.getAllClients(),
      colis: this.colisService.getAllColis({ size: 10000 }) // Get all colis
    }).subscribe({
      next: ({ clients, colis }) => {
        // Count colis per client
        const colisCountMap = new Map<string, number>();
        colis.content.forEach((c: any) => {
          if (c.clientExpediteurId) {
            colisCountMap.set(c.clientExpediteurId, (colisCountMap.get(c.clientExpediteurId) || 0) + 1);
          }
        });

        // Enrich clients with colis count
        const enrichedClients = clients.map(client => ({
          ...client,
          nombreColis: colisCountMap.get(client.id) || 0
        }));

        this.clients.set(enrichedClients);
        this.totalElements.set(enrichedClients.length);
        this.loading.set(false);
      },
      error: (error: any) => {
        console.error('Erreur chargement clients:', error);
        this.errorMessage.set('Erreur lors du chargement des clients');
        this.loading.set(false);
      }
    });
  }

  /**
   * Recherche des clients par mot-clé
   */
  private rechercherClients(keyword: string): void {
    this.loading.set(true);

    this.clientService.searchClients(keyword, this.currentPage(), this.pageSize()).subscribe({
      next: (page) => {
        this.clients.set(page.content);
        this.totalElements.set(page.totalElements);
        this.totalPages.set(page.totalPages);
        this.loading.set(false);
      },
      error: (error: any) => {
        console.error('Erreur recherche clients:', error);
        this.loading.set(false);
      }
    });
  }

  /**
   * Déclenche la recherche
   */
  onSearchChange(keyword: string): void {
    this.searchKeyword.set(keyword);
    this.searchSubject.next(keyword);
  }

  /**
   * Ouvre le modal de création
   */
  ouvrirModalCreation(): void {
    this.isEditMode.set(false);
    this.currentClient.set(null);
    this.resetForm();
    this.showModal.set(true);
  }

  /**
   * Ouvre le modal de modification
   */
  ouvrirModalModification(client: ClientExpediteur): void {
    this.isEditMode.set(true);
    this.currentClient.set(client);
    this.formData.set({
      nom: client.nom,
      prenom: client.prenom,
      email: client.email,
      telephone: client.telephone || '',
      adresse: client.adresse || '',
      userId: client.userId || ''
    });
    this.showModal.set(true);
  }

  /**
   * Sauvegarde le client (création ou modification)
   */
  sauvegarderClient(): void {
    const data = this.formData();

    if (this.isEditMode()) {
      const client = this.currentClient();
      if (!client) return;

      this.clientService.updateClient(client.id, data).subscribe({
        next: () => {
          this.chargerClients();
          this.fermerModal();
        },
        error: (error: any) => {
          console.error('Erreur modification client:', error);
          alert('Erreur lors de la modification du client');
        }
      });
    } else {
      this.clientService.createClient(data).subscribe({
        next: () => {
          this.chargerClients();
          this.fermerModal();
        },
        error: (error: any) => {
          console.error('Erreur création client:', error);
          alert('Erreur lors de la création du client');
        }
      });
    }
  }

  /**
   * Supprime un client
   */
  supprimerClient(clientId: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      this.clientService.deleteClient(clientId).subscribe({
        next: () => {
          this.chargerClients();
        },
        error: (error: any) => {
          console.error('Erreur suppression client:', error);
          alert('Erreur lors de la suppression du client');
        }
      });
    }
  }

  /**
   * Ferme tous les modals
   */
  fermerModal(): void {
    this.showModal.set(false);
    this.showColisModal.set(false);
    this.currentClient.set(null);
  }

  /**
   * Réinitialise le formulaire
   */
  private resetForm(): void {
    this.formData.set({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      adresse: '',
      userId: ''
    });
  }
}
