import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-tournee',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div style="padding: 2rem;">
      <h1>🗺️ Ma Tournée</h1>
      <p>Visualisation de la tournée en cours de développement...</p>
    </div>
  `
})
export class TourneeComponent { }
