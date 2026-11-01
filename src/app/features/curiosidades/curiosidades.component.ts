import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../shared/services/data.service';
import { Fact, Quote } from '../../shared/models';

@Component({
  selector: 'app-curiosidades',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="container">

        <div class="sec-header fade-in">
          <h2><span class="icon">🧠</span> Fatos & Curiosidades</h2>
        </div>

        <!-- FACTS -->
        @if (loading) {
          <div class="grid-3">
            @for (i of [1,2,3,4,5,6]; track i) {
              <div class="shimmer" style="height:160px;border-radius:18px"></div>
            }
          </div>
        } @else {
          <div class="grid-3 fade-in-1">
            @for (fact of facts; track fact.number; let i = $index) {
              <div class="fact-card" [style.animation-delay]="(i*0.08)+'s'" style="animation:fadeInUp 0.4s both">
                <div class="fact-num">{{ fact.number }}</div>
                <div class="fact-text">{{ fact.text }}</div>
              </div>
            }
          </div>

          <!-- NÚMERO DO DIA -->
          <div class="fade-in-2" style="margin:32px 0 24px">
            <div class="sec-header">
              <h2 style="font-size:16px">🎲 Número do dia</h2>
              <button class="btn btn-ghost" (click)="randomNumber()">🔄 Novo número</button>
            </div>
            <div class="number-card">
              <div class="number-big">{{ todayNumber }}</div>
              <div class="number-fact">{{ numberFact }}</div>
            </div>
          </div>

          <div class="ad-placeholder fade-in-2">
            📢 AdSense — Curiosidades = retenção alta = mais impressões por sessão
          </div>

          <!-- QUOTES -->
          <div class="fade-in-3" style="margin-top:24px">
            <div class="sec-header">
              <h2 style="font-size:16px">💬 Frases inspiradoras</h2>
            </div>
            @for (quote of quotes; track quote.author) {
              <div class="quote-card">
                <div class="quote-text">"{{ quote.text }}"</div>
                <div class="quote-author">— {{ quote.author }}</div>
              </div>
            }
          </div>

          <!-- VOCÊ SABIA? -->
          <div class="fade-in-4" style="margin-top:32px">
            <div class="sec-header">
              <h2 style="font-size:16px">🤯 Você sabia?</h2>
            </div>
            <div class="grid-2">
              @for (item of didYouKnow; track item.title) {
                <div class="dyk-card">
                  <div class="dyk-icon">{{ item.icon }}</div>
                  <div>
                    <div class="dyk-title">{{ item.title }}</div>
                    <div class="dyk-text">{{ item.text }}</div>
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
    .number-card {
      background: linear-gradient(135deg, #1a1564 0%, #6C63FF 100%);
      border-radius: 20px;
      padding: 40px;
      text-align: center;
      border: 1px solid rgba(108,99,255,0.3);
    }
    .number-big {
      font-size: 80px;
      font-weight: 800;
      font-family: 'Syne', sans-serif;
      color: #fff;
      line-height: 1;
    }
    .number-fact {
      font-size: 16px;
      color: rgba(255,255,255,0.8);
      margin-top: 12px;
      font-style: italic;
    }
    .dyk-card {
      display: flex;
      gap: 16px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 20px;
      cursor: pointer;
      transition: all 0.2s;
      &:hover { border-color: var(--brand); transform: translateY(-2px); }
    }
    .dyk-icon  { font-size: 32px; flex-shrink: 0; }
    .dyk-title { font-size: 14px; font-weight: 700; font-family: 'Syne', sans-serif; margin-bottom: 4px; }
    .dyk-text  { font-size: 13px; color: var(--text-muted); line-height: 1.5; }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class CuriosidadesComponent implements OnInit {
  facts: Fact[] = [];
  quotes: Quote[] = [];
  loading = true;
  todayNumber = 42;
  numberFact = '42 é a Resposta para a Vida, o Universo e Tudo Mais, segundo O Guia do Mochileiro das Galáxias.';

  didYouKnow = [
    { icon: '🐬', title: 'Golfinhos dormem com um olho aberto', text: 'Eles desligam metade do cérebro enquanto a outra metade permanece alerta para respirar e detectar predadores.' },
    { icon: '🌈', title: 'O arco-íris é um círculo completo', text: 'Do chão, vemos apenas um semicírculo. De um avião, você pode ver o círculo completo.' },
    { icon: '🧲', title: 'A Terra é um gigante ímã', text: 'O núcleo de ferro líquido da Terra gera um campo magnético que nos protege da radiação solar.' },
    { icon: '🦎', title: 'Lagartos podem crescer novos membros', text: 'Algumas espécies de lagartos regeneram suas caudas e até partes do coração e cérebro.' },
    { icon: '⚡', title: 'Raios caem 100x por segundo na Terra', text: 'A Terra recebe cerca de 100 raios a cada segundo — mais de 8 milhões por dia.' },
    { icon: '🍯', title: 'O mel nunca estraga', text: 'Arqueólogos encontraram mel com mais de 3.000 anos em tumbas egípcias — ainda comestível.' },
  ];

  private numbers = [
    { n: 42,    f: 'A Resposta para a Vida, o Universo e Tudo Mais, segundo Douglas Adams.' },
    { n: 7,     f: 'O número mais considerado "aleatório" pelos humanos quando pedem um número de 1 a 10.' },
    { n: 1729,  f: 'O menor número expressável como soma de dois cubos de duas maneiras diferentes (Hardy-Ramanujan).' },
    { n: 6174,  f: 'A constante de Kaprekar: qualquer número de 4 dígitos chega nele após repetir certa operação.' },
    { n: 196883, f: 'A menor dimensão do "Monstro" — o maior grupo esporádico simples da matemática.' },
  ];

  constructor(private data: DataService) {}

  ngOnInit() {
    this.data.getFacts().subscribe(f => { this.facts = f; this.loading = false; });
    this.data.getQuotes().subscribe(q => this.quotes = q);
  }

  randomNumber() {
    const r = this.numbers[Math.floor(Math.random() * this.numbers.length)];
    this.todayNumber = r.n;
    this.numberFact  = r.f;
  }
}
