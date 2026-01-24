import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-not-found',
    standalone: true,
    imports: [RouterLink],
    template: `
    <div class="not-found-container">
      <div class="glass-card">
        <h1>404</h1>
        <h2>Page non trouvée</h2>
        <p>Désolé, la page que vous recherchez n'existe pas ou a été déplacée.</p>
        <button routerLink="/" class="btn-primary">Retour à l'accueil</button>
      </div>
    </div>
  `,
    styles: [`
    .not-found-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: white;
      font-family: 'Inter', sans-serif;
    }
    .glass-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 3rem;
      border-radius: 1.5rem;
      text-align: center;
      max-width: 500px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
    h1 {
      font-size: 8rem;
      margin: 0;
      background: linear-gradient(to right, #38bdf8, #818cf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1;
    }
    h2 {
      font-size: 2rem;
      margin: 1rem 0;
      font-weight: 600;
    }
    p {
      color: #94a3b8;
      margin-bottom: 2rem;
      line-height: 1.6;
    }
    .btn-primary {
      background: linear-gradient(to right, #0284c7, #4f46e5);
      color: white;
      border: none;
      padding: 0.75rem 2rem;
      font-size: 1rem;
      font-weight: 500;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
    }
  `]
})
export class NotFoundComponent { }
