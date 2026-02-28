import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="app-container">
      <aside class="sidebar glass">
        <div class="brand">
          <h2 class="display-text">Maal</h2>
          <span>Admin</span>
        </div>
        
        <nav class="nav-links">
          <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
          <a routerLink="/boxes" routerLinkActive="active">Boxes</a>
          <a routerLink="/billing" routerLinkActive="active">Billing</a>
          <a routerLink="/utility" routerLinkActive="active">Utilities</a>
          <a routerLink="/maintenance" routerLinkActive="active">Maintenance</a>
        </nav>
        
        <div class="user-profile">
          <div class="user-info">
            <p class="name">Admin User</p>
            <p class="role">Mall Administrator</p>
          </div>
        </div>
      </aside>
      
      <main class="main-content">
        <header class="top-bar">
          <div class="search-box">
            <input type="text" placeholder="Search anything...">
          </div>
          <div class="actions">
            <button class="btn-icon">🔔</button>
            <button class="btn-icon logout">🔓</button>
          </div>
        </header>
        
        <section class="content-area animate-fade">
          <router-outlet></router-outlet>
        </section>
      </main>
    </div>
  `,
    styles: [`
    .app-container {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }
    
    .sidebar {
      width: 280px;
      padding: var(--space-md);
      display: flex;
      flex-direction: column;
      border-right: 1px solid var(--border-color);
      margin: 10px;
      height: calc(100vh - 20px);
    }
    
    .brand {
      margin-bottom: var(--space-lg);
    }
    
    .brand h2 {
      font-size: 2rem;
      color: var(--accent-color);
    }
    
    .brand span {
      text-transform: uppercase;
      font-size: 0.7rem;
      letter-spacing: 0.2rem;
      color: var(--text-secondary);
    }
    
    .nav-links {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      flex-grow: 1;
    }
    
    .nav-links a {
      padding: 0.8rem 1rem;
      border-radius: 8px;
      color: var(--text-secondary);
    }
    
    .nav-links a.active, .nav-links a:hover {
      background: rgba(99, 102, 241, 0.1);
      color: var(--accent-color);
    }
    
    .main-content {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
    }
    
    .top-bar {
      padding: var(--space-md);
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      background: rgba(13, 13, 15, 0.8);
      backdrop-filter: blur(8px);
      z-index: 10;
    }
    
    .search-box input {
      background: var(--surface-color);
      border: 1px solid var(--border-color);
      padding: 0.8rem 1.5rem;
      border-radius: 50px;
      color: var(--text-primary);
      width: 300px;
    }
    
    .content-area {
      padding: var(--space-md);
    }
    
    .user-profile {
      padding-top: var(--space-md);
      border-top: 1px solid var(--border-color);
    }
    
    .user-info .name {
      font-weight: 600;
      font-size: 0.9rem;
    }
    
    .user-info .role {
      font-size: 0.75rem;
      color: var(--text-secondary);
    }
    
    .btn-icon {
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      color: var(--text-primary);
      margin-left: 1rem;
    }
  `]
})
export class LayoutComponent { }
