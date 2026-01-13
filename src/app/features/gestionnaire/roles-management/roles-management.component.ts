import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { RoleService, type Role } from '../../../core/services/role.service';
import { PermissionService, type Permission } from '../../../core/services/permission.service';

/**
 * Composant pour gérer les rôles (Gestionnaire)
 */
@Component({
    selector: 'app-roles-management',
    standalone: true,
    imports: [CommonModule, FormsModule, NavbarComponent],
    templateUrl: './roles-management.component.html',
    styleUrl: './roles-management.component.css'
})
export class RolesManagementComponent implements OnInit {
    private readonly roleService = inject(RoleService);
    private readonly permissionService = inject(PermissionService);

    roles = signal<Role[]>([]);
    permissions = signal<Permission[]>([]);
    loading = signal(true);
    errorMessage = signal<string | null>(null);

    // Modal
    showPermissionsModal = signal(false);
    isEditMode = signal(false);
    currentRole = signal<Role | null>(null);

    // Formulaire
    formData = signal({
        name: ''
    });

    // Permissions sélectionnées
    selectedPermissions = signal<string[]>([]);

    ngOnInit(): void {
        this.chargerRoles();
        this.chargerPermissions();
    }

    /**
     * Charge tous les rôles
     */
    private chargerRoles(): void {
        this.loading.set(true);
        this.errorMessage.set(null);

        this.roleService.getAllRoles().subscribe({
            next: (roles) => {
                this.roles.set(roles);
                this.loading.set(false);
            },
            error: (error) => {
                console.error('Erreur chargement rôles:', error);
                this.errorMessage.set('Erreur lors du chargement des rôles');
                this.loading.set(false);
            }
        });
    }

    /**
     * Charge toutes les permissions
     */
    private chargerPermissions(): void {
        this.permissionService.getAllPermissions().subscribe({
            next: (permissions) => {
                this.permissions.set(permissions);
            },
            error: (error) => {
                console.error('Erreur chargement permissions:', error);
            }
        });
    }

    /**
     * Ouvre le modal de gestion des permissions
     */
    ouvrirModalPermissions(role: Role): void {
        this.currentRole.set(role);
        this.selectedPermissions.set(role.permissions?.map(p => p.id) || []);
        this.showPermissionsModal.set(true);
    }

    /**
     * Ferme les modals
     */
    fermerModal(): void {
        this.showPermissionsModal.set(false);
        this.currentRole.set(null);
    }

    /**
     * Toggle une permission
     */
    togglePermission(permissionId: string): void {
        const role = this.currentRole();
        if (!role) return;

        const isCurrentlyAssigned = this.selectedPermissions().includes(permissionId);

        if (isCurrentlyAssigned) {
            // Révoquer la permission
            this.roleService.revokePermissionFromRole(role.id, permissionId).subscribe({
                next: () => {
                    this.selectedPermissions.update(selected => selected.filter(id => id !== permissionId));
                    this.chargerRoles();
                },
                error: (error) => {
                    console.error('Erreur révocation permission:', error);
                    alert('Erreur lors de la révocation de la permission');
                }
            });
        } else {
            // Assigner la permission
            this.roleService.assignPermissionToRole(role.id, permissionId).subscribe({
                next: () => {
                    this.selectedPermissions.update(selected => [...selected, permissionId]);
                    this.chargerRoles();
                },
                error: (error) => {
                    console.error('Erreur assignation permission:', error);
                    alert('Erreur lors de l\'assignation de la permission');
                }
            });
        }
    }

    /**
     * Vérifie si une permission est sélectionnée
     */
    isPermissionSelected(permissionId: string): boolean {
        return this.selectedPermissions().includes(permissionId);
    }
}
