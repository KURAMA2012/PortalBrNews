import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'noticias',
    loadComponent: () => import('./features/noticias/noticias.component').then(m => m.NoticiasComponent)
  },
  {
    path: 'clima',
    loadComponent: () => import('./features/clima/clima.component').then(m => m.ClimaComponent)
  },
  {
    path: 'games',
    loadComponent: () => import('./features/games/games.component').then(m => m.GamesComponent)
  },
  {
    path: 'filmes',
    loadComponent: () => import('./features/filmes/filmes.component').then(m => m.FilmesComponent)
  },
  {
    path: 'cripto',
    loadComponent: () => import('./features/cripto/cripto.component').then(m => m.CriptoComponent)
  },
  {
    path: 'memes',
    loadComponent: () => import('./features/memes/memes.component').then(m => m.MemesComponent)
  },
  {
    path: 'curiosidades',
    loadComponent: () => import('./features/curiosidades/curiosidades.component').then(m => m.CuriosidadesComponent)
  },
  { path: '**', redirectTo: 'home' }
];
