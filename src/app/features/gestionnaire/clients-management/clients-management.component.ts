import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-clients-management',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div style="padding: 2rem;">
      <h1>👥 Gestion des Clients</h1>
      <p>Gestion des clients en cours de développement...</p>
    </div>
  `
})
export class ClientsManagementComponent { }
