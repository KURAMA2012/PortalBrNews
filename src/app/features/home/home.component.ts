import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DataService } from '../../shared/services/data.service';
import { NewsArticle, Game, CryptoAsset } from '../../shared/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page">
      <div class="container">

        <!-- HERO -->
        <div class="hero-banner fade-in">
          <div class="hero-badge">
            <span class="live-dot"></span> Atualizado agora
          </div>
          <h1>Bem-vindo ao PortalBR 🇧🇷</h1>
          <p>Notícias, clima, games, filmes, cripto e muito mais — tudo em um só lugar, sem enrolação.</p>
          <div class="hero-actions">
            <a routerLink="/noticias" class="btn btn-primary">📰 Ver notícias</a>
            <a routerLink="/cripto"   class="btn btn-ghost">💰 Mercado cripto</a>
          </div>
        </div>

        <!-- STATS -->
        <div class="grid-4 fade-in-1" style="margin-bottom:32px">
          <div class="stat-card"><div class="stat-val">2.847</div><div class="stat-lbl">Visitantes hoje</div></div>
          <div class="stat-card"><div class="stat-val">18</div><div class="stat-lbl">Notícias novas</div></div>
          <div class="stat-card"><div class="stat-val">R$541k</div><div class="stat-lbl">Bitcoin (BTC)</div></div>
          <div class="stat-card"><div class="stat-val">28°C</div><div class="stat-lbl">São Paulo agora</div></div>
        </div>

        <!-- AD BANNER -->
        <div class="ad-placeholder fade-in-2">
          📢 Google AdSense — Banner 728×90 — Espaço premium para anúncios
        </div>

        <!-- NEWS -->
        <div class="fade-in-2">
          <div class="sec-header">
            <h2><span class="icon">📰</span> Notícias em destaque</h2>
            <a routerLink="/noticias">Ver todas →</a>
          </div>

          @if (loading.news) {
            <div class="grid-3">
              @for (i of [1,2,3]; track i) {
                <div class="shimmer" style="height:260px"></div>
              }
            </div>
          } @else {
            <div class="grid-3">
              @for (article of news; track article.title) {
                <div class="news-card">
                  <div class="news-thumb" [style.background]="getNewsGradient(article.category)">
                    {{ article.emoji }}
                  </div>
                  <div class="news-body">
                    <span class="badge {{ article.category }}">{{ getCatLabel(article.category) }}</span>
                    <div class="news-title">{{ article.title }}</div>
                    <div class="news-desc">{{ article.description }}</div>
                    <div class="news-meta">{{ article.source.name }} · {{ article.publishedAt | date:'dd/MM HH:mm' }}</div>
                  </div>
                </div>
              }
            </div>
          }
        </div>

        <!-- AD -->
        <div class="ad-placeholder fade-in-3" style="margin:24px 0">
          📢 Google AdSense — 336×280 — Entre conteúdo (maior CTR)
        </div>

        <!-- GAMES + CRIPTO -->
        <div class="grid-2 fade-in-3">

          <!-- GAMES -->
          <div>
            <div class="sec-header">
              <h2><span class="icon">🎮</span> Games em alta</h2>
              <a routerLink="/games">Ver todos →</a>
            </div>

            @for (game of games; track game.id) {
              <div class="game-row">
                <div class="game-row-cover" [style.background]="game.bgColor">{{ game.emoji }}</div>
                <div class="game-row-info">
                  <div class="game-title">{{ game.name }}</div>
                  <div class="game-meta">
                    {{ game.genres[0] }} · {{ game.released }}
                    <span class="rating-text">★ {{ game.rating }}</span>
                  </div>
                </div>
                @if (game.isNew) {
                  <span class="badge game">Novo</span>
                }
              </div>
            }
          </div>

          <!-- CRIPTO -->
          <div>
            <div class="sec-header">
              <h2><span class="icon">💰</span> Mercado cripto</h2>
              <a routerLink="/cripto">Ver mais →</a>
            </div>

            @for (c of cryptos; track c.id) {
              <div class="cripto-row">
                <div class="cripto-sym">{{ c.emoji }}</div>
                <div class="cripto-info">
                  <div class="cripto-name">{{ c.name }}</div>
                  <div class="cripto-sub">{{ c.symbol }}</div>
                </div>
                <div class="cripto-prices">
                  <div class="cripto-usd">{{ c.priceUsd | currency:'USD':'symbol':'1.2-2' }}</div>
                  <div [class]="c.change24h >= 0 ? 'up cripto-chg' : 'down cripto-chg'">
                    {{ c.change24h >= 0 ? '+' : '' }}{{ c.change24h | number:'1.1-1' }}%
                  </div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- QUOTE DO DIA -->
        <div class="fade-in-4" style="margin-top:32px">
          <div class="sec-header">
            <h2><span class="icon">🧠</span> Frase do dia</h2>
          </div>
          <div class="quote-card">
            <div class="quote-text">"A única maneira de fazer um trabalho brilhante é amar o que você faz."</div>
            <div class="quote-author">— Steve Jobs</div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .game-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px;
      border-radius: 10px;
      background: var(--surface);
      border: 1px solid var(--border);
      margin-bottom: 8px;
      transition: all 0.2s;
      cursor: pointer;
      &:hover { border-color: var(--brand); transform: translateX(3px); }
    }

    .game-row-cover {
      width: 44px;
      height: 44px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      flex-shrink: 0;
    }

    .game-row-info { flex: 1; min-width: 0; }
    .game-title { font-size: 13px; font-weight: 600; font-family: 'Syne', sans-serif; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .game-meta { font-size: 11px; color: var(--text-muted); display: flex; gap: 8px; margin-top: 2px; }
    .rating-text { color: #ffd93d; font-weight: 600; }

    .cripto-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      margin-bottom: 8px;
      transition: all 0.2s;
      cursor: pointer;
      &:hover { border-color: var(--brand); }
    }

    .cripto-sym { font-size: 22px; width: 32px; text-align: center; flex-shrink: 0; }
    .cripto-info { flex: 1; }
    .cripto-name { font-size: 13px; font-weight: 600; font-family: 'Syne', sans-serif; color: var(--text); }
    .cripto-sub  { font-size: 11px; color: var(--text-faint); }
    .cripto-prices { text-align: right; }
    .cripto-usd  { font-size: 14px; font-weight: 600; font-family: 'Syne', sans-serif; color: var(--text); }
    .cripto-chg  { font-size: 12px; font-weight: 600; font-family: 'Syne', sans-serif; }
  `]
})
export class HomeComponent implements OnInit {
  news: NewsArticle[] = [];
  games: Game[] = [];
  cryptos: CryptoAsset[] = [];
  loading = { news: true, games: true, cripto: true };

  constructor(private data: DataService) {}

  ngOnInit() {
    this.data.getNews().subscribe(n => { this.news = n.slice(0, 3); this.loading.news = false; });
    this.data.getGames().subscribe(g => { this.games = g.slice(0, 4); this.loading.games = false; });
    this.data.getCryptos().subscribe(c => { this.cryptos = c.slice(0, 5); this.loading.cripto = false; });
  }

  getNewsGradient(cat: string): string {
    const map: Record<string, string> = {
      tech: 'linear-gradient(135deg,#1a1564,#4B44CC)',
      finance: 'linear-gradient(135deg,#1a1200,#7a5c00)',
      sci: 'linear-gradient(135deg,#001a1a,#005c5c)',
      sports: 'linear-gradient(135deg,#1a0000,#7a0000)',
      world: 'linear-gradient(135deg,#001a00,#005c00)',
    };
    return map[cat] ?? 'var(--bg3)';
  }

  getCatLabel(cat: string): string {
    const map: Record<string, string> = {
      tech: 'Tecnologia', finance: 'Finanças', sci: 'Ciência',
      sports: 'Esportes', world: 'Mundo'
    };
    return map[cat] ?? cat;
  }
}
