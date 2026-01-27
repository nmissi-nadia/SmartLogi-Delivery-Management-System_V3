import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-access-denied',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="access-denied-container">
      <div class="glass-card">
        <div class="icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 text-red-500">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
        <h1>403</h1>
        <h2>Accès Refusé</h2>
        <p>Désolé, vous n'avez pas les permissions nécessaires pour accéder à cette page. Veuillez contacter votre administrateur si vous pensez qu'il s'agit d'une erreur.</p>
        <button routerLink="/" class="btn-primary">Retour à l'accueil</button>
      </div>
    </div>
  `,
  styles: [`
    .access-denied-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
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
    .icon-wrapper {
      margin-bottom: 1.5rem;
      display: flex;
      justify-content: center;
    }
    .w-16 { width: 4rem; }
    .h-16 { height: 4rem; }
    .text-red-500 { color: #ef4444; }
    h1 {
      font-size: 6rem;
      margin: 0;
      color: #ef4444;
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
      background: linear-gradient(to right, #4338ca, #6366f1);
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
export class AccessDeniedComponent { }
