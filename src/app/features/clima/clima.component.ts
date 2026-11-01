import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../shared/services/data.service';
import { WeatherData } from '../../shared/models';

@Component({
  selector: 'app-clima',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="container">
        <div class="sec-header fade-in">
          <h2><span class="icon">🌦️</span> Clima na sua cidade</h2>
        </div>

        <!-- SEARCH -->
        <div class="search-row fade-in" style="margin-bottom:24px">
          <input [(ngModel)]="cityInput" placeholder="Buscar cidade (ex: Rio de Janeiro, Curitiba...)"
                 (keyup.enter)="search()">
          <button class="btn btn-primary" (click)="search()">🔍 Buscar</button>
        </div>

        <!-- QUICK CITIES -->
        <div class="chips-scroll fade-in-1" style="margin-bottom:24px">
          @for (city of quickCities; track city) {
            <button class="chip" (click)="loadCity(city)">{{ city }}</button>
          }
        </div>

        @if (loading) {
          <div class="shimmer" style="height:180px;margin-bottom:20px;border-radius:24px"></div>
          <div class="grid-4">
            @for (i of [1,2,3,4,5]; track i) {
              <div class="shimmer" style="height:120px"></div>
            }
          </div>
        } @else if (weather) {
          <!-- MAIN CARD -->
          <div class="weather-main fade-in">
            <div class="weather-icon">{{ weather.icon }}</div>
            <div class="weather-info">
              <h2>{{ weather.city }}</h2>
              <p>{{ weather.description }}</p>
              <div class="weather-details">
                <span>💧 Umidade: {{ weather.humidity }}%</span>
                <span>💨 Vento: {{ weather.windSpeed }}km/h</span>
                <span>🌡️ Sensação: {{ weather.feelsLike }}°C</span>
              </div>
            </div>
            <div class="weather-temp">{{ weather.temp }}°C</div>
          </div>

          <!-- FORECAST -->
          <div class="sec-header fade-in-1">
            <h2 style="font-size:16px">Previsão para 5 dias</h2>
          </div>
          <div class="grid-5 fade-in-2">
            @for (day of weather.forecast; track day.day) {
              <div class="forecast-card">
                <div class="fc-day">{{ day.day }}</div>
                <div class="fc-icon">{{ day.emoji }}</div>
                <div class="fc-high">{{ day.high }}°</div>
                <div class="fc-low">{{ day.low }}°</div>
              </div>
            }
          </div>

          <!-- UV/EXTRA INFO -->
          <div class="grid-3 fade-in-3" style="margin-top:20px">
            <div class="info-card"><div class="info-icon">☀️</div><div class="info-val">Alto</div><div class="info-lbl">Índice UV</div></div>
            <div class="info-card"><div class="info-icon">🌅</div><div class="info-val">06:12</div><div class="info-lbl">Nascer do sol</div></div>
            <div class="info-card"><div class="info-icon">🌇</div><div class="info-val">18:48</div><div class="info-lbl">Pôr do sol</div></div>
          </div>

          <div class="ad-placeholder fade-in-4" style="margin-top:24px">
            📢 AdSense — Clima é muito buscado no Google — CPM médio: R$8-12
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .search-row { display: flex; gap: 12px; }
    input { flex: 1; }

    .weather-details {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 12px;
      font-size: 13px;
      color: rgba(255,255,255,0.75);
    }

    .grid-5 {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 12px;
      @media (max-width: 600px) { grid-template-columns: repeat(3, 1fr); }
    }

    .forecast-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px 12px;
      text-align: center;
      transition: all 0.2s;
      &:hover { border-color: var(--brand); transform: translateY(-2px); }
    }
    .fc-day  { font-size: 12px; font-family: 'Syne', sans-serif; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
    .fc-icon { font-size: 28px; margin: 8px 0; }
    .fc-high { font-size: 18px; font-weight: 700; font-family: 'Syne', sans-serif; color: var(--text); }
    .fc-low  { font-size: 13px; color: var(--text-faint); margin-top: 2px; }

    .info-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
      text-align: center;
    }
    .info-icon { font-size: 28px; margin-bottom: 8px; }
    .info-val  { font-size: 20px; font-weight: 700; font-family: 'Syne', sans-serif; }
    .info-lbl  { font-size: 12px; color: var(--text-muted); margin-top: 4px; }
  `]
})
export class ClimaComponent implements OnInit {
  weather: WeatherData | null = null;
  loading = true;
  cityInput = 'São Paulo';

  quickCities = ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Curitiba', 'Salvador', 'Fortaleza', 'Belo Horizonte', 'Recife'];

  constructor(private data: DataService) {}

  ngOnInit() { this.loadCity('São Paulo'); }

  loadCity(city: string) {
    this.cityInput = city;
    this.search();
  }

  search() {
    this.loading = true;
    this.data.getWeather(this.cityInput || 'São Paulo').subscribe(w => {
      this.weather = w;
      this.loading = false;
    });
  }
}
