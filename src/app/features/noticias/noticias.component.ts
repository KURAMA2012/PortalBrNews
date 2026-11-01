import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../shared/services/data.service';
import { NewsArticle } from '../../shared/models';

@Component({
  selector: 'app-noticias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="container">
        <div class="fade-in">
          <div class="sec-header">
            <h2><span class="icon">📰</span> Notícias do Dia</h2>
            <span style="font-size:12px;color:var(--text-faint)">
              <span class="live-dot"></span> Atualizado às {{ now | date:'HH:mm' }}
            </span>
          </div>

          <!-- SEARCH -->
          <div class="search-row" style="margin-bottom:16px">
            <input [(ngModel)]="query" placeholder="Buscar notícias..." (ngModelChange)="filter()">
          </div>

          <!-- CATEGORY CHIPS -->
          <div class="chips-scroll" style="margin-bottom:24px">
            @for (cat of categories; track cat.value) {
              <button class="chip" [class.active]="selectedCat === cat.value" (click)="setCategory(cat.value)">
                {{ cat.icon }} {{ cat.label }}
              </button>
            }
          </div>

          <!-- NEWS GRID -->
          <div class="ad-placeholder">📢 AdSense — Banner 728×90 — Topo da página</div>

          @if (loading) {
            <div class="grid-3" style="margin-top:16px">
              @for (i of [1,2,3,4,5,6]; track i) {
                <div class="shimmer" style="height:280px"></div>
              }
            </div>
          } @else if (filtered.length === 0) {
            <div style="text-align:center;padding:60px 0;color:var(--text-muted)">
              <div style="font-size:40px;margin-bottom:12px">🔍</div>
              <p>Nenhuma notícia encontrada para "{{ query }}"</p>
            </div>
          } @else {
            <div class="grid-3" style="margin-top:16px">
              @for (article of filtered; track article.title; let i = $index) {
                <div class="news-card" [style.animation-delay]="(i*0.05)+'s'" style="animation: fadeInUp 0.4s both">
                  <div class="news-thumb" [style.background]="getGradient(article.category)">
                    <span style="font-size:44px">{{ article.emoji }}</span>
                  </div>
                  <div class="news-body">
                    <span class="badge {{ article.category }}">{{ getCatLabel(article.category) }}</span>
                    <div class="news-title">{{ article.title }}</div>
                    <div class="news-desc">{{ article.description }}</div>
                    <div class="news-meta">
                      {{ article.source.name }} · {{ article.publishedAt | date:'dd/MM/yyyy HH:mm' }}
                    </div>
                  </div>
                </div>
              }
            </div>

            <div class="ad-placeholder" style="margin-top:24px">📢 AdSense — 336×280 — Após lista (alto CTR)</div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .search-row { display: flex; gap: 12px; }
    input { flex: 1; }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class NoticiasComponent implements OnInit {
  news: NewsArticle[] = [];
  filtered: NewsArticle[] = [];
  loading = true;
  query = '';
  selectedCat = 'all';
  now = new Date();

  categories = [
    { value: 'all',     icon: '📋', label: 'Tudo' },
    { value: 'tech',    icon: '💻', label: 'Tecnologia' },
    { value: 'world',   icon: '🌍', label: 'Mundo' },
    { value: 'finance', icon: '💰', label: 'Finanças' },
    { value: 'sci',     icon: '🔬', label: 'Ciência' },
    { value: 'sports',  icon: '⚽', label: 'Esportes' },
  ];

  constructor(private data: DataService) {}

  ngOnInit() {
    this.data.getNews().subscribe(news => {
      this.news = news;
      this.filtered = news;
      this.loading = false;
    });
  }

  setCategory(cat: string) {
    this.selectedCat = cat;
    this.filter();
  }

  filter() {
    let result = this.news;
    if (this.selectedCat !== 'all') result = result.filter(n => n.category === this.selectedCat);
    if (this.query.trim()) {
      const q = this.query.toLowerCase();
      result = result.filter(n => n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q));
    }
    this.filtered = result;
  }

  getGradient(cat: string): string {
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
