import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../shared/services/data.service';
import { CryptoAsset } from '../../shared/models';

@Component({
  selector: 'app-cripto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="container">

        <div class="sec-header fade-in">
          <h2><span class="icon">💰</span> Criptomoedas & Finanças</h2>
          <span style="font-size:12px;color:var(--text-faint)">
            <span class="live-dot"></span> Dados em tempo real
          </span>
        </div>

        <!-- TICKER -->
        <div class="chips-scroll fade-in" style="margin-bottom:28px">
          @for (c of cryptos; track c.id) {
            <div class="crypto-pill">
              <div class="crypto-sym">{{ c.emoji }} {{ c.symbol }}</div>
              <div class="crypto-price">{{ c.priceUsd | currency:'USD':'symbol':'1.2-2' }}</div>
              <div class="crypto-brl">R$ {{ c.priceBrl | number:'1.0-0' }}</div>
              <div class="crypto-chg" [class]="c.change24h >= 0 ? 'up' : 'down'">
                {{ c.change24h >= 0 ? '▲' : '▼' }} {{ c.change24h | number:'1.1-1' }}%
              </div>
            </div>
          }
        </div>

        <div class="grid-2 fade-in-1" style="margin-bottom:28px">

          <!-- CONVERSOR -->
          <div>
            <div class="sec-header">
              <h2 style="font-size:16px">💱 Conversor de Moedas</h2>
            </div>
            <div class="converter-card">
              <div class="conv-row">
                <input type="number" [(ngModel)]="convVal" placeholder="Valor" min="0">
                <select [(ngModel)]="convFrom">
                  <option value="BRL">🇧🇷 BRL</option>
                  <option value="USD">🇺🇸 USD</option>
                  <option value="EUR">🇪🇺 EUR</option>
                  <option value="GBP">🇬🇧 GBP</option>
                  <option value="JPY">🇯🇵 JPY</option>
                  <option value="ARS">🇦🇷 ARS</option>
                </select>
              </div>
              <div class="conv-arrow">↕️</div>
              <div class="conv-row">
                <div class="conv-result-val">{{ convertedValue | number:'1.2-2' }}</div>
                <select [(ngModel)]="convTo" (ngModelChange)="convert()">
                  <option value="USD">🇺🇸 USD</option>
                  <option value="BRL">🇧🇷 BRL</option>
                  <option value="EUR">🇪🇺 EUR</option>
                  <option value="GBP">🇬🇧 GBP</option>
                  <option value="JPY">🇯🇵 JPY</option>
                  <option value="ARS">🇦🇷 ARS</option>
                </select>
              </div>
              <button class="btn btn-primary" style="width:100%;margin-top:16px" (click)="convert()">
                🔄 Converter
              </button>
              @if (convertedValue > 0) {
                <div class="conv-summary">
                  {{ convVal }} {{ convFrom }} = <strong>{{ convertedValue | number:'1.2-2' }} {{ convTo }}</strong>
                </div>
              }
            </div>
          </div>

          <!-- MARKET -->
          <div>
            <div class="sec-header">
              <h2 style="font-size:16px">📊 Mercado Global</h2>
            </div>
            <div class="market-list">
              @for (item of marketItems; track item.name) {
                <div class="market-row">
                  <div class="market-icon">{{ item.icon }}</div>
                  <div class="market-info">
                    <div class="market-name">{{ item.name }}</div>
                    <div class="market-sub">{{ item.sub }}</div>
                  </div>
                  <div class="market-right">
                    <div class="market-price">{{ item.price }}</div>
                    <div [class]="item.up ? 'up market-chg' : 'down market-chg'">
                      {{ item.up ? '▲' : '▼' }} {{ item.change }}
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- FULL TABLE -->
        <div class="fade-in-2">
          <div class="sec-header">
            <h2 style="font-size:16px">📋 Tabela completa</h2>
          </div>
          <div class="table-wrap">
            <table class="crypto-table">
              <thead>
                <tr>
                  <th>#</th><th>Ativo</th><th>Preço USD</th><th>Preço BRL</th>
                  <th>24h</th><th>Market Cap</th>
                </tr>
              </thead>
              <tbody>
                @for (c of cryptos; track c.id; let i = $index) {
                  <tr>
                    <td class="rank">{{ i + 1 }}</td>
                    <td class="asset-cell">
                      <span class="asset-emoji">{{ c.emoji }}</span>
                      <div>
                        <div class="asset-name">{{ c.name }}</div>
                        <div class="asset-sym">{{ c.symbol }}</div>
                      </div>
                    </td>
                    <td>{{ c.priceUsd | currency:'USD':'symbol':'1.2-2' }}</td>
                    <td>R$ {{ c.priceBrl | number:'1.0-0' }}</td>
                    <td [class]="c.change24h >= 0 ? 'up' : 'down'">
                      {{ c.change24h >= 0 ? '+' : '' }}{{ c.change24h | number:'1.1-1' }}%
                    </td>
                    <td class="muted">{{ c.marketCap }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <div class="ad-placeholder fade-in-3" style="margin-top:24px">
          📢 AdSense — Finanças = CPM mais alto do portal — R$10-18
        </div>
      </div>
    </div>
  `,
  styles: [`
    .converter-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 24px;
    }
    .conv-row {
      display: flex; gap: 10px;
      input, select { flex: 1; }
    }
    .conv-arrow { text-align: center; font-size: 20px; margin: 10px 0; }
    .conv-result-val {
      flex: 1;
      background: var(--bg3);
      border: 1px solid var(--border2);
      border-radius: 12px;
      padding: 10px 16px;
      font-size: 18px;
      font-weight: 700;
      font-family: 'Syne', sans-serif;
      color: var(--brand);
      display: flex;
      align-items: center;
    }
    .conv-summary {
      text-align: center;
      margin-top: 12px;
      font-size: 14px;
      color: var(--text-muted);
      strong { color: var(--text); }
    }
    .market-list { display: flex; flex-direction: column; gap: 8px; }
    .market-row {
      display: flex; align-items: center; gap: 12px;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 12px; padding: 12px 14px;
      transition: all 0.2s;
      &:hover { border-color: var(--brand); }
    }
    .market-icon { font-size: 24px; }
    .market-info { flex: 1; }
    .market-name { font-size: 14px; font-weight: 600; font-family: 'Syne', sans-serif; }
    .market-sub  { font-size: 11px; color: var(--text-faint); }
    .market-right { text-align: right; }
    .market-price { font-size: 15px; font-weight: 700; font-family: 'Syne', sans-serif; }
    .market-chg   { font-size: 12px; font-weight: 600; font-family: 'Syne', sans-serif; }

    .table-wrap { overflow-x: auto; border-radius: 16px; border: 1px solid var(--border); }
    .crypto-table {
      width: 100%; border-collapse: collapse;
      th {
        background: var(--bg3);
        padding: 12px 16px;
        text-align: left;
        font-size: 12px;
        font-family: 'Syne', sans-serif;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--text-faint);
      }
      td {
        padding: 14px 16px;
        border-top: 1px solid var(--border);
        font-size: 14px;
        color: var(--text);
        background: var(--surface);
      }
      tr:hover td { background: var(--bg3); }
    }
    .rank { color: var(--text-faint); font-weight: 600; width: 40px; }
    .asset-cell { display: flex; align-items: center; gap: 10px; }
    .asset-emoji { font-size: 22px; }
    .asset-name { font-weight: 600; font-family: 'Syne', sans-serif; font-size: 14px; }
    .asset-sym  { font-size: 11px; color: var(--text-faint); }
    .muted { color: var(--text-muted) !important; }
  `]
})
export class CriptoComponent implements OnInit {
  cryptos: CryptoAsset[] = [];
  rates: Record<string, number> = {};
  convVal = 100;
  convFrom = 'BRL';
  convTo = 'USD';
  convertedValue = 0;

  marketItems = [
    { icon: '📈', name: 'S&P 500',  sub: 'EUA',    price: '5.842',    change: '0.8%', up: true  },
    { icon: '💵', name: 'Dólar',    sub: 'USD/BRL', price: 'R$ 5,55',  change: '0.2%', up: false },
    { icon: '🥇', name: 'Ouro',     sub: 'XAU/USD', price: '$2.310',   change: '0.6%', up: true  },
    { icon: '🛢️', name: 'Petróleo', sub: 'WTI',     price: '$82,40',   change: '1.1%', up: true  },
  ];

  constructor(private data: DataService) {}

  ngOnInit() {
    this.data.getCryptos().subscribe(c => this.cryptos = c);
    this.data.getRates().subscribe(r => { this.rates = r; this.convert(); });
  }

  convert() {
    if (!this.rates[this.convFrom] || !this.rates[this.convTo]) return;
    const usd = this.convVal / this.rates[this.convFrom];
    this.convertedValue = usd * this.rates[this.convTo];
  }
}
