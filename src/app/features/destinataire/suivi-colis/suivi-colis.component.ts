import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-suivi-colis',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div style="padding: 2rem;">
      <h1>📍 Suivi de Colis</h1>
      <p>Suivi des colis destinés en cours de développement...</p>
    </div>
  `
})
export class SuiviColisComponent { }
