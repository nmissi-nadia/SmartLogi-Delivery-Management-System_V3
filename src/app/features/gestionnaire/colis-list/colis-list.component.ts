import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-colis-list',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div style="padding: 2rem;">
      <h1>📦 Liste des Colis</h1>
      <p>Liste complète des colis en cours de développement...</p>
    </div>
  `
})
export class ColisListComponent { }
