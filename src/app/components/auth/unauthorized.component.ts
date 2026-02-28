import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-unauthorized',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div class="max-w-md w-full text-center glass bg-white p-12 shadow-xl rounded-[3rem] border-gray-100">
        <div class="text-6xl mb-6">🚫</div>
        <h1 class="text-3xl font-display font-black text-gray-900 mb-4">Unauthorized</h1>
        <p class="text-gray-500 mb-8 font-medium italic">You do not have the required permissions to access this portal.</p>
        <a routerLink="/login" class="inline-block px-8 py-4 bg-gray-900 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-600 transition-all">
          Return to Login
        </a>
      </div>
    </div>
  `,
    styles: [`
    :host { display: block; }
  `]
})
export class UnauthorizedComponent { }
