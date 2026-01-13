import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { UserService, type User } from '../../../core/services/user.service';

/**
 * Composant pour gérer les utilisateurs (Gestionnaire)
 */
@Component({
    selector: 'app-users-management',
    standalone: true,
    imports: [CommonModule, FormsModule, NavbarComponent],
    templateUrl: './users-management.component.html',
    styleUrl: './users-management.component.css'
})
export class UsersManagementComponent implements OnInit {
    private readonly userService = inject(UserService);

    users = signal<User[]>([]);
    loading = signal(true);
    errorMessage = signal<string | null>(null);

    // Modal
    showModal = signal(false);
    isEditMode = signal(false);
    currentUser = signal<User | null>(null);

    // Formulaire
    formData = signal({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        enabled: true
    });

    ngOnInit(): void {
        this.chargerUtilisateurs();
    }

    /**
     * Charge tous les utilisateurs
     */
    private chargerUtilisateurs(): void {
        this.loading.set(true);
        this.errorMessage.set(null);

        this.userService.getAllUsers().subscribe({
            next: (users) => {
                this.users.set(users);
                this.loading.set(false);
            },
            error: (error) => {
                console.error('Erreur chargement utilisateurs:', error);
                this.errorMessage.set('Erreur lors du chargement des utilisateurs');
                this.loading.set(false);
            }
        });
    }

    /**
     * Ouvre le modal pour créer un utilisateur
     */
    ouvrirModalCreation(): void {
        this.isEditMode.set(false);
        this.currentUser.set(null);
        this.formData.set({
            username: '',
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            enabled: true
        });
        this.showModal.set(true);
    }

    /**
     * Ouvre le modal pour modifier un utilisateur
     */
    ouvrirModalModification(user: User): void {
        this.isEditMode.set(true);
        this.currentUser.set(user);
        this.formData.set({
            username: user.username,
            email: user.email,
            password: '',
            firstName: user.firstName,
            lastName: user.lastName,
            enabled: user.enabled
        });
        this.showModal.set(true);
    }

    /**
     * Ferme le modal
     */
    fermerModal(): void {
        this.showModal.set(false);
        this.currentUser.set(null);
    }

    /**
     * Soumet le formulaire
     */
    soumettre(): void {
        const data = this.formData();

        if (!data.username || !data.email || !data.firstName || !data.lastName || (!this.isEditMode() && !data.password)) {
            alert('Veuillez remplir tous les champs obligatoires');
            return;
        }

        if (this.isEditMode()) {
            this.modifierUtilisateur();
        } else {
            this.creerUtilisateur();
        }
    }

    /**
     * Crée un nouvel utilisateur
     */
    private creerUtilisateur(): void {
        const data = this.formData();

        const payload = {
            username: data.username,
            email: data.email,
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
            enabled: data.enabled
        };

        console.log('Payload envoyé:', payload);

        // TODO: Implémenter createUser dans UserService
        alert('Fonctionnalité de création à implémenter côté backend');
        this.fermerModal();
    }

    /**
     * Modifie un utilisateur existant
     */
    private modifierUtilisateur(): void {
        const user = this.currentUser();
        if (!user) return;

        const data = this.formData();
        const payload: any = {
            username: data.username,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            enabled: data.enabled
        };

        // Ajouter le password seulement s'il est renseigné
        if (data.password) {
            payload.password = data.password;
        }

        console.log('Payload envoyé:', payload);

        // TODO: Implémenter updateUser dans UserService
        alert('Fonctionnalité de modification à implémenter côté backend');
        this.fermerModal();
    }

    /**
     * Supprime un utilisateur
     */
    supprimerUtilisateur(userId: string): void {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            // TODO: Implémenter deleteUser dans UserService
            alert('Fonctionnalité de suppression à implémenter côté backend');
        }
    }

    /**
     * Toggle l'état enabled d'un utilisateur
     */
    toggleEnabled(user: User): void {
        user.enabled = !user.enabled;
        // TODO: Implémenter la mise à jour côté backend
        console.log(`Utilisateur ${user.username} ${user.enabled ? 'activé' : 'désactivé'}`);
    }
}
