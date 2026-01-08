import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-mes-colis',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div style="padding: 2rem;">
      <h1>📦 Mes Colis Assignés</h1>
      <p>Liste des colis assignés en cours de développement...</p>
    </div>
  `
})
export class MesColisComponent { }
