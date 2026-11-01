import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../shared/services/data.service';
import { Game } from '../../shared/models';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="container">

        <div class="sec-header fade-in">
          <h2><span class="icon">🎮</span> Games em Alta</h2>
        </div>

        <div class="ad-placeholder fade-in">📢 AdSense — Games tem CPM alto com público jovem — R$5-9</div>

        @if (loading) {
          <div style="margin-top:20px">
            <div class="grid-4">
              @for (i of [1,2,3,4,5,6,7,8]; track i) {
                <div class="shimmer" style="height:220px;border-radius:18px"></div>
              }
            </div>
          </div>
        } @else {
          <!-- POPULARES -->
          <div class="fade-in-1" style="margin-top:20px">
            <div class="sec-header">
              <h2 style="font-size:16px">🔥 Mais populares</h2>
            </div>
            <div class="grid-4">
              @for (game of popular; track game.id; let i = $index) {
                <div class="game-card" [style.animation-delay]="(i*0.06)+'s'" style="animation:fadeInUp 0.4s both">
                  <div class="game-cover" [style.background]="game.bgColor">
                    {{ game.emoji }}
                    <div class="rating-badge">★ {{ game.rating }}</div>
                  </div>
                  <div class="game-info">
                    <div class="game-title">{{ game.name }}</div>
                    <div class="game-meta">
                      <span>{{ game.genres[0] }}</span>
                      <span>{{ game.released }}</span>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- LANÇAMENTOS -->
          <div class="fade-in-2" style="margin-top:32px">
            <div class="sec-header">
              <h2 style="font-size:16px">🆕 Lançamentos</h2>
            </div>
            <div class="grid-4">
              @for (game of newGames; track game.id; let i = $index) {
                <div class="game-card" [style.animation-delay]="(i*0.06)+'s'" style="animation:fadeInUp 0.4s both">
                  <div class="game-cover" [style.background]="game.bgColor">
                    {{ game.emoji }}
                    <div class="rating-badge">★ {{ game.rating }}</div>
                    <div class="new-badge">NOVO</div>
                  </div>
                  <div class="game-info">
                    <div class="game-title">{{ game.name }}</div>
                    <div class="game-meta">
                      <span>{{ game.genres[0] }}</span>
                      <span>{{ game.released }}</span>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>

          <div class="ad-placeholder fade-in-3" style="margin-top:32px">
            📢 AdSense Sidebar — 300×600 — Games
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .new-badge {
      position: absolute;
      top: 8px; left: 8px;
      background: var(--accent);
      color: #fff;
      border-radius: 6px;
      padding: 2px 7px;
      font-size: 10px;
      font-weight: 800;
      font-family: 'Syne', sans-serif;
      letter-spacing: 0.06em;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class GamesComponent implements OnInit {
  games: Game[] = [];
  popular: Game[] = [];
  newGames: Game[] = [];
  loading = true;

  constructor(private data: DataService) {}

  ngOnInit() {
    this.data.getGames().subscribe(games => {
      this.games = games;
      this.popular  = games.filter(g => !g.isNew);
      this.newGames = games.filter(g =>  g.isNew);
      this.loading  = false;
    });
  }
}
