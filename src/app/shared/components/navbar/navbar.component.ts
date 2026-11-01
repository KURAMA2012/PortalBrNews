import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="navbar">
      <div class="nav-inner">
        <a routerLink="/home" class="logo">
          <span class="logo-icon">🌐</span>
          <span class="logo-text">Portal<span class="logo-accent">BR</span></span>
        </a>

        <button class="menu-toggle" (click)="menuOpen = !menuOpen" [class.open]="menuOpen">
          <span></span><span></span><span></span>
        </button>

        <div class="nav-links" [class.open]="menuOpen">
          @for (item of navItems; track item.path) {
            <a [routerLink]="item.path"
               routerLinkActive="active"
               class="nav-link"
               (click)="menuOpen = false">
              <span class="nav-icon">{{ item.icon }}</span>
              <span class="nav-label">{{ item.label }}</span>
            </a>
          }
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: rgba(15, 14, 23, 0.9);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }

    .nav-inner {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 24px;
      height: 60px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      margin-right: 16px;
      flex-shrink: 0;
    }

    .logo-icon { font-size: 20px; }

    .logo-text {
      font-family: 'Syne', sans-serif;
      font-size: 20px;
      font-weight: 800;
      color: #fffffe;
      letter-spacing: -0.5px;
    }

    .logo-accent { color: #6C63FF; }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 2px;
      flex: 1;
      overflow-x: auto;
      scrollbar-width: none;
      &::-webkit-scrollbar { display: none; }
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 13px;
      font-family: 'Syne', sans-serif;
      font-weight: 500;
      color: #a7a5c6;
      text-decoration: none;
      white-space: nowrap;
      transition: all 0.2s;
      flex-shrink: 0;

      &:hover {
        background: rgba(108, 99, 255, 0.1);
        color: #fffffe;
      }

      &.active {
        background: rgba(108, 99, 255, 0.15);
        color: #6C63FF;
      }
    }

    .nav-icon { font-size: 14px; }

    .menu-toggle {
      display: none;
      flex-direction: column;
      gap: 5px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      margin-left: auto;

      span {
        display: block;
        width: 22px;
        height: 2px;
        background: #a7a5c6;
        border-radius: 2px;
        transition: all 0.3s;
      }
    }

    @media (max-width: 768px) {
      .menu-toggle { display: flex; }

      .nav-links {
        display: none;
        position: absolute;
        top: 60px;
        left: 0;
        right: 0;
        background: rgba(26, 25, 40, 0.98);
        border-bottom: 1px solid rgba(255,255,255,0.08);
        padding: 12px 16px;
        flex-wrap: wrap;
        gap: 4px;

        &.open { display: flex; }
      }
    }
  `]
})
export class NavbarComponent {
  menuOpen = false;

  navItems = [
    { path: '/home',        icon: '🏠', label: 'Início' },
    { path: '/noticias',    icon: '📰', label: 'Notícias' },
    { path: '/clima',       icon: '🌦️', label: 'Clima' },
    { path: '/games',       icon: '🎮', label: 'Games' },
    { path: '/filmes',      icon: '🎬', label: 'Filmes' },
    { path: '/cripto',      icon: '💰', label: 'Cripto' },
    { path: '/memes',       icon: '😂', label: 'Memes' },
    { path: '/curiosidades',icon: '🧠', label: 'Curiosidades' },
  ];
}
