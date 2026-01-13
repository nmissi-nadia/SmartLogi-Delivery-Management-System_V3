import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

interface MenuItem {
    label: string;
    icon: string;
    route: string;
    roles: string[];
}

/**
 * Composant Sidebar pour la navigation
 */
@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    isCollapsed = signal(false);
    currentUser = signal<any>(null);
    userRoles = signal<string[]>([]);

    menuItems: MenuItem[] = [
        // Client
        { label: 'Dashboard', icon: '📊', route: '/client/dashboard', roles: ['ROLE_CLIENT'] },
        { label: 'Nouvelle Livraison', icon: '➕', route: '/client/nouvelle-livraison', roles: ['ROLE_CLIENT'] },
        { label: 'Mes Colis', icon: '📦', route: '/client/mes-colis', roles: ['ROLE_CLIENT'] },
        { label: 'Historique', icon: '📜', route: '/client/historique', roles: ['ROLE_CLIENT'] },

        // Gestionnaire - Dashboard
        { label: 'Dashboard', icon: '📊', route: '/gestionnaire/dashboard', roles: ['ROLE_GESTIONNAIRE'] },

        // Livreur
        { label: 'Mes Livraisons', icon: '🚚', route: '/livreur/mes-colis', roles: ['ROLE_LIVREUR'] },
        { label: 'Ma Tournée', icon: '🗺️', route: '/livreur/tournee', roles: ['ROLE_LIVREUR'] },

        // Destinataire
        { label: 'Suivi Colis', icon: '📍', route: '/destinataire/suivi-colis', roles: ['ROLE_DESTINATAIRE'] }
    ];

    // Sous-menus pour le gestionnaire
    gestionnaireSubMenus = {
        gestion: {
            label: 'Gestion',
            icon: '⚙️',
            expanded: signal(false),
            items: [
                { label: 'Colis', icon: '📦', route: '/gestionnaire/colis-list' },
                { label: 'Clients', icon: '👥', route: '/gestionnaire/clients-management' },
                { label: 'Livreurs', icon: '🚛', route: '/gestionnaire/livreurs-management' },
                { label: 'Zones', icon: '🗺️', route: '/gestionnaire/zones' },
                { label: 'Utilisateurs', icon: '👤', route: '/gestionnaire/users' },
                { label: 'Rôles', icon: '🔐', route: '/gestionnaire/roles' }
            ]
        }
    };

    ngOnInit(): void {
        // S'abonner aux changements de l'utilisateur
        this.authService.currentUser$.subscribe(user => {
            this.currentUser.set(user);
        });

        // Charger les rôles
        this.userRoles.set(this.authService.getUserRoles());

        // Ajouter la classe 'with-sidebar' au body
        document.body.classList.add('with-sidebar');
    }

    ngOnDestroy(): void {
        // Retirer la classe quand le composant est détruit
        document.body.classList.remove('with-sidebar');
    }

    /**
     * Filtre les items du menu selon le rôle de l'utilisateur
     */
    get filteredMenuItems(): MenuItem[] {
        const roles = this.userRoles();
        return this.menuItems.filter(item =>
            item.roles.some(role => roles.includes(role))
        );
    }

    /**
     * Toggle la sidebar (collapse/expand)
     */
    toggleSidebar(): void {
        this.isCollapsed.update(value => !value);

        // Ajouter/retirer la classe collapsed sur le body
        if (this.isCollapsed()) {
            document.body.classList.add('sidebar-collapsed');
        } else {
            document.body.classList.remove('sidebar-collapsed');
        }
    }

    /**
     * Déconnexion
     */
    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

    /**
     * Toggle un sous-menu
     */
    toggleSubMenu(subMenu: any): void {
        subMenu.expanded.update((value: boolean) => !value);
    }

    /**
     * Vérifie si l'utilisateur a le rôle gestionnaire
     */
    isGestionnaire(): boolean {
        return this.userRoles().includes('ROLE_GESTIONNAIRE');
    }

    /**
     * Retourne les initiales de l'utilisateur
     */
    getUserInitials(): string {
        const user = this.currentUser();
        if (!user?.username) return 'U';
        return user.username.substring(0, 2).toUpperCase();
    }
}
