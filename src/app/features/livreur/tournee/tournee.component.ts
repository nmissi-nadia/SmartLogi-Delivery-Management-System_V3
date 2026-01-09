import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Composant placeholder pour la tournée du livreur
 */
@Component({
    selector: 'app-tournee',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div style="padding: 2rem; text-align: center;">
      <h1>🗺️ Ma Tournée</h1>
      <p>Cette fonctionnalité est en cours de développement.</p>
    </div>
  `,
    styles: [`
    div {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    h1 {
      color: var(--text-dark);
      margin-bottom: 1rem;
    }
    p {
      color: var(--text-gray);
    }
  `]
})
export class TourneeComponent { }
