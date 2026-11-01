import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../shared/services/data.service';
import { Movie } from '../../shared/models';

@Component({
  selector: 'app-filmes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="container">

        <div class="sec-header fade-in">
          <h2><span class="icon">🎬</span> Filmes & Séries</h2>
        </div>

        <div class="ad-placeholder fade-in">📢 AdSense — Filmes/Séries gera muito tráfego via SEO — R$6-10 CPM</div>

        @if (loading) {
          <div class="grid-4" style="margin-top:20px">
            @for (i of [1,2,3,4,5,6,7,8]; track i) {
              <div class="shimmer" style="height:320px;border-radius:18px"></div>
            }
          </div>
        } @else {

          <!-- TRENDING -->
          <div class="fade-in-1" style="margin-top:20px">
            <div class="sec-header">
              <h2 style="font-size:16px">🔥 Em alta agora</h2>
            </div>
            <div class="grid-4">
              @for (m of trending; track m.id; let i = $index) {
                <div class="movie-card" [style.animation-delay]="(i*0.06)+'s'" style="animation:fadeInUp 0.4s both">
                  <div class="movie-poster" [style.background]="m.bgColor">
                    <span>{{ m.emoji }}</span>
                    <div class="movie-rating">⭐ {{ m.rating | number:'1.1-1' }}</div>
                  </div>
                  <div class="movie-info">
                    <div class="movie-title">{{ m.title }}</div>
                    <div class="movie-genre">{{ m.genre }} · {{ m.year }}</div>
                    <div class="movie-stars">{{ getStars(m.rating) }}</div>
                    <div class="movie-overview">{{ m.overview }}</div>
                  </div>
                </div>
              }
            </div>
          </div>

          <div class="ad-placeholder fade-in-2" style="margin-top:24px">📢 AdSense — Entre seções</div>

          <!-- TOP RATED -->
          <div class="fade-in-3" style="margin-top:24px">
            <div class="sec-header">
              <h2 style="font-size:16px">⭐ Mais bem avaliados</h2>
            </div>
            <div class="grid-4">
              @for (m of topRated; track m.id; let i = $index) {
                <div class="movie-card" [style.animation-delay]="(i*0.06)+'s'" style="animation:fadeInUp 0.4s both">
                  <div class="movie-poster" [style.background]="m.bgColor">
                    <span>{{ m.emoji }}</span>
                    <div class="movie-rating">⭐ {{ m.rating | number:'1.1-1' }}</div>
                  </div>
                  <div class="movie-info">
                    <div class="movie-title">{{ m.title }}</div>
                    <div class="movie-genre">{{ m.genre }} · {{ m.year }}</div>
                    <div class="movie-stars">{{ getStars(m.rating) }}</div>
                    <div class="movie-overview">{{ m.overview }}</div>
                  </div>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .movie-rating {
      position: absolute;
      bottom: 8px; right: 8px;
      background: rgba(0,0,0,0.75);
      border-radius: 6px;
      padding: 3px 8px;
      font-size: 12px;
      font-weight: 700;
      font-family: 'Syne', sans-serif;
      color: #ffd93d;
    }
    .movie-overview {
      font-size: 11px;
      color: var(--text-faint);
      margin-top: 6px;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class FilmesComponent implements OnInit {
  movies: Movie[] = [];
  trending: Movie[] = [];
  topRated: Movie[] = [];
  loading = true;

  constructor(private data: DataService) {}

  ngOnInit() {
    this.data.getMovies().subscribe(movies => {
      this.movies   = movies;
      this.trending = movies.slice(0, 4);
      this.topRated = [...movies].sort((a, b) => b.rating - a.rating).slice(0, 4);
      this.loading  = false;
    });
  }

  getStars(rating: number): string {
    const stars = Math.round(rating / 2);
    return '★'.repeat(stars) + '☆'.repeat(5 - stars);
  }
}
