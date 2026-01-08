import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div style="padding: 2rem;">
      <h1>📊 Dashboard Gestionnaire</h1>
      <p>Tableau de bord en cours de développement...</p>
    </div>
  `
})
export class DashboardComponent { }
