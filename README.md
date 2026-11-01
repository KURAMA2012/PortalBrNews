# 🌐 PortalBR — Portal Tudo-em-Um

> Portal Angular 17 com Notícias, Clima, Games, Filmes, Cripto, Memes e Curiosidades — pronto para monetização com Google AdSense.

---

## 🚀 Como rodar

### Pré-requisitos
- Node.js 18+
- npm 9+

### Instalação

```bash
# 1. Instale as dependências
npm install

# 2. Rode em desenvolvimento
npm start

# 3. Acesse em http://localhost:4200
```

### Build para produção

```bash
npm run build:prod
# Arquivos gerados em: dist/portalbr/
```

---

## 🔑 Configurando as APIs

Edite o arquivo `src/environments/environment.ts` e insira suas chaves:

| API | Onde pegar | Gratuita? |
|-----|-----------|-----------|
| **NewsAPI** | https://newsapi.org | ✅ 100 req/dia grátis |
| **OpenWeatherMap** | https://openweathermap.org/api | ✅ 1000 req/dia grátis |
| **RAWG (Games)** | https://rawg.io/apidocs | ✅ Gratuita |
| **TMDB (Filmes)** | https://www.themoviedb.org/settings/api | ✅ Gratuita |
| **CoinGecko (Cripto)** | https://www.coingecko.com/api | ✅ Gratuita sem key |
| **ExchangeRate API** | https://www.exchangerate-api.com | ✅ 1500 req/mês grátis |
| **Giphy (Memes)** | https://developers.giphy.com | ✅ Gratuita |

### Como conectar uma API real (exemplo: Clima)

Edite `src/app/shared/services/data.service.ts`:

```typescript
// ANTES (mock):
getWeather(city: string): Observable<WeatherData> {
  return of(mockData).pipe(delay(600));
}

// DEPOIS (API real):
getWeather(city: string): Observable<WeatherData> {
  const key = environment.weatherApiKey;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric&lang=pt_br`;
  return this.http.get<any>(url).pipe(
    map(res => ({
      city: res.name,
      temp: Math.round(res.main.temp),
      feelsLike: Math.round(res.main.feels_like),
      humidity: res.main.humidity,
      windSpeed: Math.round(res.wind.speed * 3.6),
      description: res.weather[0].description,
      icon: this.getWeatherEmoji(res.weather[0].id),
      forecast: []
    }))
  );
}
```

---

## 📁 Estrutura do projeto

```
portalbr/
├── src/
│   ├── app/
│   │   ├── features/
│   │   │   ├── home/            # Página inicial
│   │   │   ├── noticias/        # Notícias com filtro
│   │   │   ├── clima/           # Previsão do tempo
│   │   │   ├── games/           # Jogos populares
│   │   │   ├── filmes/          # Filmes e séries
│   │   │   ├── cripto/          # Criptomoedas + conversor
│   │   │   ├── memes/           # Memes + like/share
│   │   │   └── curiosidades/    # Fatos + frases
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   │   └── navbar/      # Navegação responsiva
│   │   │   ├── services/
│   │   │   │   └── data.service.ts  # Todas as APIs
│   │   │   └── models/
│   │   │       └── index.ts     # Interfaces TypeScript
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   └── app.routes.ts        # Lazy loading de rotas
│   ├── environments/
│   │   ├── environment.ts       # Chaves dev
│   │   └── environment.prod.ts  # Chaves produção
│   ├── styles.scss              # Estilos globais (design system)
│   └── index.html
├── angular.json
├── package.json
└── tsconfig.json
```

---

## 💰 Estratégia de Monetização

### Google AdSense
O projeto já tem placeholders `.ad-placeholder` em todas as páginas. Para ativar:

1. Crie uma conta em https://adsense.google.com
2. Adicione o script do AdSense no `index.html`
3. Substitua os `.ad-placeholder` por unidades de anúncio reais

### CPM estimado por seção (Brasil)
| Seção | CPM estimado |
|-------|-------------|
| 💰 Finanças/Cripto | R$ 10–18 |
| 💻 Tecnologia | R$ 6–12 |
| 🌦️ Clima | R$ 8–12 |
| 🎮 Games | R$ 5–9 |
| 🎬 Filmes | R$ 6–10 |
| 😂 Memes | R$ 3–6 |

---

## 🔧 Tecnologias

- **Angular 17** — Standalone components + Lazy loading
- **RxJS** — Gerenciamento reativo de dados
- **TypeScript 5** — Tipagem forte
- **SCSS** — Design system customizado (tema dark)
- **Google Fonts** — Syne (display) + DM Sans (corpo)

---

## 🌐 Deploy

### Vercel (recomendado — gratuito)
```bash
npm i -g vercel
npm run build:prod
vercel dist/portalbr/browser
```

### Netlify
```bash
npm run build:prod
# Arraste a pasta dist/portalbr/browser para app.netlify.com
```

### GitHub Pages
```bash
npx angular-cli-ghpages --dir=dist/portalbr/browser
```

---

## 📈 SEO — Como rankear no Google

1. **Meta tags** — já configuradas no `index.html`
2. **Rotas semânticas** — `/noticias`, `/clima`, `/games`
3. **SSR (Angular Universal)** — para máximo SEO, adicione:
   ```bash
   ng add @angular/ssr
   ```
4. **Sitemap** — gere em https://www.xml-sitemaps.com
5. **Google Search Console** — registre o site em https://search.google.com/search-console

---

Feito com ❤️ — PortalBR 2026
