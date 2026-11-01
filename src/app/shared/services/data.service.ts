import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, of, delay, forkJoin, map, catchError } from 'rxjs';
import {
  NewsArticle, WeatherData, Game, Movie,
  CryptoAsset, Meme, Fact, Quote
} from '../models';

// ============================================================
//  MOCK DATA  (substitua por chamadas HTTP reais abaixo)
// ============================================================
@Injectable({ providedIn: 'root' })
export class DataService {

  private readonly api = environment.apiBase;

  constructor(private http: HttpClient) {}

  private shortCap(v: number): string {
    if (!v) return '-';
    const d = String.fromCharCode(36);
    if (v >= 1e12) return d + (v / 1e12).toFixed(1) + 'T';
    if (v >= 1e9) return d + Math.round(v / 1e9) + 'B';
    if (v >= 1e6) return d + Math.round(v / 1e6) + 'M';
    return d + Math.round(v);
  }

  // â”€â”€ NEWS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // PROD: GET https://newsapi.org/v2/top-headlines?country=br&apiKey=SUA_KEY 
  getNews(category?: string): Observable<NewsArticle[]> {
    const all: NewsArticle[] = [
      { title: 'IA supera humanos em diagnÃ³stico mÃ©dico, aponta novo estudo', description: 'Modelo de inteligÃªncia artificial detectou doenÃ§as com 94% de precisÃ£o em testes clÃ­nicos realizados em 12 paÃ­ses.', url: '#', publishedAt: '2026-04-10T08:00:00Z', source: { name: 'TechBR' }, category: 'tech', emoji: 'ðŸ¤–' },
      { title: 'Brasil atinge recorde histÃ³rico de exportaÃ§Ãµes em 2026', description: 'BalanÃ§a comercial registra superÃ¡vit de US$120 bilhÃµes, impulsionado pelo agronegÃ³cio e tecnologia.', url: '#', publishedAt: '2026-04-10T07:30:00Z', source: { name: 'EconoBR' }, category: 'finance', emoji: 'ðŸ“ˆ' },
      { title: 'Novo planeta habitÃ¡vel descoberto a 40 anos-luz da Terra', description: 'TelescÃ³pio James Webb confirma presenÃ§a de vapor de Ã¡gua e atmosfera estÃ¡vel em exoplaneta GJ 1002b.', url: '#', publishedAt: '2026-04-10T06:00:00Z', source: { name: 'ScienceBR' }, category: 'sci', emoji: 'ðŸª' },
      { title: 'Copa do Mundo 2026: Brasil confirma convocaÃ§Ã£o preliminar', description: 'SeleÃ§Ã£o brasileira anuncia lista com novos talentos para os amistosos de preparaÃ§Ã£o em junho.', url: '#', publishedAt: '2026-04-10T09:00:00Z', source: { name: 'SportsBR' }, category: 'sports', emoji: 'âš½' },
      { title: 'Apple lanÃ§a MacBook com chip M5 Ultra de 3nm aprimorado', description: 'Novo processador promete performance 40% superior e autonomia de atÃ© 30 horas de uso.', url: '#', publishedAt: '2026-04-09T14:00:00Z', source: { name: 'TechBR' }, category: 'tech', emoji: 'ðŸ’»' },
      { title: 'Banco Central anuncia corte de 0,5pp na Selic para 9,5%', description: 'DecisÃ£o surpreende o mercado e derruba o dÃ³lar frente ao real na tarde de quinta-feira.', url: '#', publishedAt: '2026-04-09T18:00:00Z', source: { name: 'EconoBR' }, category: 'finance', emoji: 'ðŸ¦' },
      { title: 'ONU aprova tratado global de regulaÃ§Ã£o de IA com 150 paÃ­ses', description: 'Acordo histÃ³rico define diretrizes mÃ­nimas para desenvolvimento e uso de inteligÃªncia artificial.', url: '#', publishedAt: '2026-04-08T12:00:00Z', source: { name: 'MundoBR' }, category: 'world', emoji: 'ðŸŒ' },
      { title: 'MissÃ£o Artemis III pousa os primeiros humanos na Lua em 56 anos', description: 'NASA e parceiros internacionais comemoram retorno histÃ³rico Ã  superfÃ­cie lunar.', url: '#', publishedAt: '2026-04-07T20:00:00Z', source: { name: 'ScienceBR' }, category: 'sci', emoji: 'ðŸš€' },
      { title: 'Flamengo vence Libertadores com gol nos acrÃ©scimos', description: 'MengÃ£o conquista o bicampeonato em virada Ã©pica no EstÃ¡dio Monumental de Buenos Aires.', url: '#', publishedAt: '2026-04-06T23:00:00Z', source: { name: 'SportsBR' }, category: 'sports', emoji: 'ðŸ†' },
    ];
    const filtered = category && category !== 'all' ? all.filter(n => n.category === category) : all;
    // Via proxy (server/). Sem NEWSAPI_KEY o proxy responde 503 e caimos no mock.
    const params = { category: category || 'all' };
    return this.http.get<NewsArticle[]>(this.api + '/news', { params }).pipe(
      map(r => { if (!Array.isArray(r) || !r.length) throw new Error('vazio'); return r; }),
      catchError(() => of(filtered))
    );
  }

  // â”€â”€ WEATHER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // PROD: GET https://api.openweathermap.org/data/2.5/weather?q={city}&appid=SUA_KEY&units=metric&lang=pt_br
  getWeather(city: string): Observable<WeatherData> {
    const mock: WeatherData = {
      city,
      temp: 27,
      feelsLike: 29,
      humidity: 72,
      windSpeed: 18,
      description: 'Parcialmente nublado',
      icon: 'â›…',
      forecast: [
        { day: 'Seg', emoji: 'â˜€ï¸', high: 30, low: 22 },
        { day: 'Ter', emoji: 'â›…', high: 28, low: 20 },
        { day: 'Qua', emoji: 'ðŸŒ§ï¸', high: 24, low: 18 },
        { day: 'Qui', emoji: 'â›…', high: 26, low: 19 },
        { day: 'Sex', emoji: 'â˜€ï¸', high: 31, low: 23 },
      ]
    };
    return this.http.get<WeatherData>(this.api + '/weather', { params: { city } }).pipe(
      map(r => ({ ...r, forecast: r.forecast?.length ? r.forecast : mock.forecast })),
      catchError(() => of(mock))
    );
  }

  // â”€â”€ GAMES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // PROD: GET https://api.rawg.io/api/games?key=SUA_KEY&ordering=-rating&page_size=20
  getGames(): Observable<Game[]> {
    const fallback: Game[] = [
      { id: 1, name: 'Elden Ring: Nightreign', rating: 9.4, genres: ['RPG', 'Souls-like'], released: '2025', emoji: 'âš”ï¸', bgColor: '#26215C' },
      { id: 2, name: 'GTA VI',                rating: 9.8, genres: ['AÃ§Ã£o', 'Mundo Aberto'], released: '2026', emoji: 'ðŸ™ï¸', bgColor: '#1a1a10', isNew: true },
      { id: 3, name: 'Hollow Knight 2',       rating: 9.1, genres: ['Metroidvania', 'Indie'], released: '2025', emoji: 'ðŸ¦‹', bgColor: '#0d1a0d' },
      { id: 4, name: 'Minecraft 2',           rating: 8.7, genres: ['Sandbox', 'Survival'], released: '2026', emoji: 'ðŸ§±', bgColor: '#1a2d10', isNew: true },
      { id: 5, name: 'Cyberpunk 2078',        rating: 8.9, genres: ['RPG', 'FPS'], released: '2025', emoji: 'ðŸ¤–', bgColor: '#0d0020' },
      { id: 6, name: 'Zelda: Echoes+',        rating: 9.5, genres: ['Aventura', 'Puzzle'], released: '2025', emoji: 'ðŸ—¡ï¸', bgColor: '#102010' },
      { id: 7, name: 'FIFA 2027',             rating: 8.3, genres: ['Esportes', 'Futebol'], released: '2026', emoji: 'âš½', bgColor: '#080818', isNew: true },
      { id: 8, name: 'Hades III',             rating: 9.6, genres: ['Roguelike', 'AÃ§Ã£o'], released: '2026', emoji: 'ðŸ”¥', bgColor: '#1a0505', isNew: true },
    ];
    return this.http.get<Game[]>(this.api + '/games').pipe(
      map(r => { if (!Array.isArray(r) || !r.length) throw new Error('vazio'); return r; }),
      catchError(() => of(fallback))
    );
  }

  // â”€â”€ MOVIES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // PROD: GET https://api.themoviedb.org/3/movie/popular?api_key=SUA_KEY&language=pt-BR
  getMovies(): Observable<Movie[]> {
    const fallback: Movie[] = [
      { id: 1, title: 'Dune: Parte III',        overview: 'A conclusÃ£o Ã©pica da saga de Paul Atreides em Arrakis.', genre: 'FicÃ§Ã£o CientÃ­fica', year: 2025, rating: 9.1, emoji: 'ðŸœï¸', bgColor: '#2a1a00' },
      { id: 2, title: 'Avengers: Kang Dynasty', overview: 'Os Vingadores enfrentam o mais poderoso vilÃ£o do multiverso.', genre: 'AÃ§Ã£o / Aventura', year: 2026, rating: 8.5, emoji: 'ðŸ¦¸', bgColor: '#00101e', isNew: true } as any,
      { id: 3, title: 'O Senhor dos AnÃ©is',     overview: 'A nova sÃ©rie de filmes da Terra MÃ©dia comeÃ§a aqui.', genre: 'Fantasia', year: 2025, rating: 9.4, emoji: 'ðŸ’', bgColor: '#0d1a00' },
      { id: 4, title: 'Matrix: Awakening',      overview: 'Neo retorna para revelar a verdade final sobre a Matrix.', genre: 'FicÃ§Ã£o / AÃ§Ã£o', year: 2026, rating: 8.7, emoji: 'ðŸ’Š', bgColor: '#001a00', isNew: true } as any,
      { id: 5, title: 'Interestelar 2',         overview: 'Uma nova missÃ£o atravÃ©s de buracos de minhoca ameaÃ§a a humanidade.', genre: 'Sci-Fi / Drama', year: 2025, rating: 9.3, emoji: 'ðŸš€', bgColor: '#00001a' },
      { id: 6, title: 'John Wick 5',            overview: 'A Ãºltima danÃ§a do assassino mais letal do cinema.', genre: 'AÃ§Ã£o / Thriller', year: 2026, rating: 8.2, emoji: 'ðŸ”«', bgColor: '#1a0000', isNew: true } as any,
      { id: 7, title: 'Barbie 2',               overview: 'De volta ao mundo real, Barbie enfrenta novos desafios.', genre: 'ComÃ©dia', year: 2025, rating: 8.0, emoji: 'ðŸ©·', bgColor: '#1a0010' },
      { id: 8, title: 'Oppenheimer 2',          overview: 'O legado atÃ´mico e as consequÃªncias para o mundo moderno.', genre: 'Drama HistÃ³rico', year: 2026, rating: 9.0, emoji: 'ðŸ’¥', bgColor: '#1a1a00', isNew: true } as any,
    ];
    return this.http.get<Movie[]>(this.api + '/movies').pipe(
      map(r => { if (!Array.isArray(r) || !r.length) throw new Error('vazio'); return r; }),
      catchError(() => of(fallback))
    );
  }

  // â”€â”€ CRYPTO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // PROD: GET https://api.coingecko.com/api/v3/coins/markets?vs_currency=brl&order=market_cap_desc&per_page=10
  getCryptos(): Observable<CryptoAsset[]> {
    const fallback: CryptoAsset[] = [
      { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', priceUsd: 97540, priceBrl: 541320, change24h: 2.4, marketCap: '$1.9T', emoji: '₿' },
      { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', priceUsd: 3320, priceBrl: 18432, change24h: 1.8, marketCap: '$400B', emoji: 'Ξ' },
      { id: 'solana', name: 'Solana', symbol: 'SOL', priceUsd: 186, priceBrl: 1032, change24h: -0.9, marketCap: '$85B', emoji: '◎' },
      { id: 'bnb', name: 'BNB', symbol: 'BNB', priceUsd: 584, priceBrl: 3241, change24h: 0.5, marketCap: '$88B', emoji: '🟡' },
      { id: 'cardano', name: 'Cardano', symbol: 'ADA', priceUsd: 0.56, priceBrl: 3.12, change24h: -1.2, marketCap: '$20B', emoji: '🔵' },
      { id: 'avalanche', name: 'Avalanche', symbol: 'AVAX', priceUsd: 36.8, priceBrl: 204, change24h: 3.1, marketCap: '$15B', emoji: '🔺' },
    ];
    const emojis: Record<string, string> = { BTC: '₿', ETH: 'Ξ', SOL: '◎' };
    const base = 'https://api.coingecko.com/api/v3/coins/markets?order=market_cap_desc&per_page=10&page=1&vs_currency=';
    return forkJoin({
      brl: this.http.get<any[]>(base + 'brl'),
      usd: this.http.get<any[]>(base + 'usd').pipe(catchError(() => of([] as any[]))),
    }).pipe(
      map(({ brl, usd }) => brl.map((c: any): CryptoAsset => {
        const u = usd.find((x: any) => x.id === c.id);
        const sym = String(c.symbol || '').toUpperCase();
        return {
          id: c.id, name: c.name, symbol: sym,
          priceBrl: c.current_price ?? 0,
          priceUsd: u?.current_price ?? 0,
          change24h: Number((c.price_change_percentage_24h ?? 0).toFixed(2)),
          marketCap: this.shortCap(u?.market_cap ?? 0),
          emoji: emojis[sym] ?? '🪙',
        };
      })),
      catchError(() => of(fallback))
    );
  }

  // â”€â”€ EXCHANGE RATES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // PROD: GET https://v6.exchangerate-api.com/v6/SUA_KEY/latest/USD
  getRates(): Observable<Record<string, number>> {
    const fallback: Record<string, number> = { USD: 1, EUR: 0.92, BRL: 5.55, GBP: 0.79, JPY: 149.5, ARS: 890 };
    return this.http.get<Record<string, number>>(this.api + '/rates').pipe(
      catchError(() => of(fallback))
    );
  }

  // â”€â”€ MEMES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // PROD: GET https://api.imgflip.com/get_memes  (free, sem key!)
  getMemes(): Observable<Meme[]> {
    const pool: Meme[] = [
      { id: '1', name: 'Quando o cafÃ© acaba na segunda de manhÃ£', url: '#', emoji: 'ðŸ˜­' },
      { id: '2', name: 'Stack Overflow em 2026: tudo Ã© respondido por IA', url: '#', emoji: 'ðŸ’€' },
      { id: '3', name: "Eu Ã s 23h: 'sÃ³ mais um episÃ³dio'", url: '#', emoji: 'ðŸ¸' },
      { id: '4', name: 'Meu cÃ³digo vs o cÃ³digo em produÃ§Ã£o', url: '#', emoji: 'ðŸ¤¡' },
      { id: '5', name: 'Quando finalmente funciona e nÃ£o sabe por quÃª', url: '#', emoji: 'ðŸ˜¤' },
      { id: '6', name: 'ReuniÃ£o que poderia ser um e-mail', url: '#', emoji: 'ðŸ¥²' },
      { id: '7', name: 'Fazer deploy Ã s 18h59 de sexta', url: '#', emoji: 'ðŸ’£' },
      { id: '8', name: 'git commit -m "fix" (pela 14Âª vez)', url: '#', emoji: 'ðŸ”¨' },
      { id: '9', name: 'Quando o cliente diz "Ã© sÃ³ uma coisinha rÃ¡pida"', url: '#', emoji: 'ðŸ˜°' },
    ];
    const shuffle = <T>(a: T[]) => [...a].sort(() => Math.random() - 0.5);
    return this.http.get<any>('https://api.imgflip.com/get_memes').pipe(
      map(r => {
        const memes: Meme[] = (r?.data?.memes ?? []).map((m: any) => ({ id: String(m.id), name: m.name, url: m.url, emoji: '😂' }));
        if (!r?.success || !memes.length) throw new Error('imgflip vazio');
        return shuffle(memes).slice(0, 9);
      }),
      catchError(() => of(shuffle(pool)))
    );
  }

  // â”€â”€ FACTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // PROD: GET https://uselessfacts.jsph.pl/api/v2/facts/random
  getFacts(): Observable<Fact[]> {
    const fallback: Fact[] = [
      { number: '8B',   text: 'bilhÃµes de pessoas vivem na Terra â€” nÃºmero sem precedente na histÃ³ria humana' },
      { number: '71%',  text: 'da superfÃ­cie terrestre Ã© coberta por Ã¡gua, mas apenas 3% Ã© potÃ¡vel' },
      { number: '2T',   text: 'Ã© o nÃºmero estimado de galÃ¡xias no universo observÃ¡vel' },
      { number: '100B', text: 'neurÃ´nios formam o cÃ©rebro humano â€” mais que estrelas na Via LÃ¡ctea' },
      { number: '1440', text: 'minutos tem cada dia. O tempo Ã© o Ãºnico recurso que nÃ£o se recupera.' },
      { number: '432Hz', text: 'Ã© a frequÃªncia musical que mÃºsicos debatem hÃ¡ dÃ©cadas se Ã© mais harmÃ´nica' },
    ];
    // A API retorna 1 fato por chamada: fazemos 6 em paralelo. Como so traz texto, "number" vira um rotulo #1..#6.
    const url = 'https://uselessfacts.jsph.pl/api/v2/facts/random?language=en';
    const calls = Array.from({ length: 6 }, () => this.http.get<any>(url).pipe(catchError(() => of(null))));
    return forkJoin(calls).pipe(
      map(rs => {
        const facts: Fact[] = rs.filter(r => r?.text).map((r, i) => ({ number: '#' + (i + 1), text: String(r.text) }));
        if (!facts.length) throw new Error('sem fatos');
        return facts;
      }),
      catchError(() => of(fallback))
    );
  }

  // â”€â”€ QUOTES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // PROD: GET https://zenquotes.io/api/quotes
  // Chamado via proxy (server/) porque zenquotes.io nao envia Access-Control-Allow-Origin (CORS).
  getQuotes(): Observable<Quote[]> {
    const fallback: Quote[] = [
      { text: 'A Ãºnica maneira de fazer um trabalho brilhante Ã© amar o que vocÃª faz.', author: 'Steve Jobs' },
      { text: 'O segredo para ir em frente Ã© comeÃ§ar.', author: 'Mark Twain' },
      { text: 'NÃ£o Ã© a forÃ§a, mas o conhecimento que nos torna poderosos.', author: 'Samuel Johnson' },
      { text: 'A criatividade Ã© a inteligÃªncia se divertindo.', author: 'Albert Einstein' },
      { text: 'O sucesso Ã© a soma de pequenos esforÃ§os repetidos dia apÃ³s dia.', author: 'Robert Collier' },
    ];
    return this.http.get<Quote[]>(this.api + '/quotes').pipe(
      map(r => { if (!Array.isArray(r) || !r.length) throw new Error('vazio'); return r; }),
      catchError(() => of(fallback))
    );
  }
}
