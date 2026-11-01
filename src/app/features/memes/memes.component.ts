import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../shared/services/data.service';
import { Meme } from '../../shared/models';

@Component({
  selector: 'app-memes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="container">

        <div class="sec-header fade-in">
          <h2><span class="icon">😂</span> Memes & Entretenimento</h2>
          <button class="btn btn-primary" (click)="reload()" [disabled]="loading">
            {{ loading ? '⏳ Carregando...' : '🔄 Novos memes' }}
          </button>
        </div>

        <div class="ad-placeholder fade-in">
          📢 AdSense — Memes = alto compartilhamento = muito tráfego orgânico
        </div>

        @if (loading) {
          <div class="grid-3" style="margin-top:20px">
            @for (i of [1,2,3,4,5,6]; track i) {
              <div class="shimmer" style="height:260px;border-radius:18px"></div>
            }
          </div>
        } @else {
          <div class="grid-3" style="margin-top:20px">
            @for (meme of memes; track meme.id; let i = $index) {
              <div class="meme-card" [style.animation-delay]="(i*0.06)+'s'" style="animation:fadeInUp 0.4s both"
                   (click)="share(meme)">
                <div class="meme-img" [style.background]="getBg(i)">
                  {{ meme.emoji }}
                </div>
                <div class="meme-title">{{ meme.name }}</div>
                <div class="meme-footer">
                  <button class="meme-btn" (click)="$event.stopPropagation(); like(meme)">
                    ❤️ {{ getLikes(meme.id) }}
                  </button>
                  <button class="meme-btn" (click)="$event.stopPropagation(); share(meme)">
                    📤 Compartilhar
                  </button>
                </div>
              </div>
            }
          </div>

          <div class="ad-placeholder fade-in-3" style="margin-top:24px">
            📢 AdSense — Pós-memes — usuário fica na página = mais impressões
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .meme-footer {
      display: flex;
      gap: 8px;
      padding: 8px 14px 12px;
      border-top: 1px solid var(--border);
    }
    .meme-btn {
      flex: 1;
      background: var(--bg3);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 6px;
      font-size: 12px;
      cursor: pointer;
      color: var(--text-muted);
      font-family: 'DM Sans', sans-serif;
      transition: all 0.2s;
      &:hover { border-color: var(--brand); color: var(--text); }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class MemesComponent implements OnInit {
  memes: Meme[] = [];
  loading = true;
  private likes: Record<string, number> = {};

  constructor(private data: DataService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.data.getMemes().subscribe(m => {
      this.memes = m;
      this.loading = false;
    });
  }

  reload() { this.load(); }

  getBg(i: number): string {
    const bgs = ['#1a1564','#1a0a00','#001a00','#1a0014','#00101a','#1a1500'];
    return bgs[i % bgs.length];
  }

  getLikes(id: string): number {
    if (!this.likes[id]) this.likes[id] = Math.floor(Math.random() * 980) + 20;
    return this.likes[id];
  }

  like(meme: Meme) {
    this.likes[meme.id] = (this.likes[meme.id] || 0) + 1;
  }

  share(meme: Meme) {
    if (navigator.share) {
      navigator.share({ title: meme.name, text: meme.name, url: window.location.href });
    }
  }
}
