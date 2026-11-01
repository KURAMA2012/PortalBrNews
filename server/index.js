'use strict';
require('dotenv').config({ path: require('path').join(__dirname, '.env'), quiet: true });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const PORT = Number(process.env.PORT) || 3333;
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGIN || 'http://127.0.0.1:4200')
  .split(',').map(s => s.trim()).filter(Boolean);
const TIMEOUT_MS = 8000;
const CATEGORIES = { tech: 'technology', world: 'general', finance: 'business', sports: 'sports', sci: 'science' };
const EMOJI = { tech: '\u{1F916}', world: '\u{1F30E}', finance: '\u{1F4C8}', sports: '\u26BD', sci: '\u{1F52D}' };

const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: ALLOWED_ORIGINS, methods: ['GET'] }));
app.use(rateLimit({ windowMs: 60_000, limit: 60, standardHeaders: 'draft-7', legacyHeaders: false,
  message: { error: 'Muitas requisicoes, tente de novo em 1 minuto' } }));

// Log minimo: metodo + rota + status (sem query string, que poderia conter dados)
app.use((req, res, next) => {
  res.on('finish', () => console.log(`${req.method} ${req.path} ${res.statusCode}`));
  next();
});

class HttpError extends Error { constructor(status, msg) { super(msg); this.status = status; } }

function key(name) {
  const v = (process.env[name] || '').trim();
  if (!v) throw new HttpError(503, `chave ${name} nao configurada`);
  return v;
}

async function getJson(url) {
  let r;
  try {
    r = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS), headers: { Accept: 'application/json' } });
  } catch (e) {
    throw new HttpError(e.name === 'TimeoutError' ? 504 : 502, 'falha ao contatar a API externa');
  }
  if (!r.ok) throw new HttpError(502, `API externa respondeu ${r.status}`);
  return r.json();
}

// Wrapper: erros viram JSON generico, sem vazar URL/chave
const route = fn => async (req, res) => {
  try { res.json(await fn(req)); }
  catch (e) {
    const status = e instanceof HttpError ? e.status : 500;
    res.status(status).json({ error: e instanceof HttpError ? e.message : 'erro interno' });
  }
};

const api = express.Router();

api.get('/health', (req, res) => res.json({ ok: true }));

api.get('/news', route(async req => {
  const cat = String(req.query.category || 'all');
  if (cat !== 'all' && !CATEGORIES[cat]) throw new HttpError(400, 'categoria invalida');
  const k = key('NEWSAPI_KEY');
  const params = new URLSearchParams({ country: 'br', pageSize: '20', apiKey: k });
  if (cat !== 'all') params.set('category', CATEGORIES[cat]);
  const d = await getJson(`https://newsapi.org/v2/top-headlines?${params}`);
  return (d.articles || []).map(a => ({
    title: a.title || '', description: a.description || '', url: a.url || '#',
    urlToImage: a.urlToImage || undefined, publishedAt: a.publishedAt || '',
    source: { name: a.source?.name || '' },
    category: cat === 'all' ? 'world' : cat, emoji: EMOJI[cat] || '\u{1F4F0}',
  }));
}));

api.get('/weather', route(async req => {
  const city = String(req.query.city || '').trim();
  if (!city || city.length > 60 || !/^[\p{L}\p{M} .,'-]+$/u.test(city)) throw new HttpError(400, 'cidade invalida');
  const k = key('OPENWEATHER_KEY');
  const d = await getJson(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${encodeURIComponent(k)}&units=metric&lang=pt_br`);
  return {
    city: d.name || city, temp: Math.round(d.main?.temp ?? 0), feelsLike: Math.round(d.main?.feels_like ?? 0),
    humidity: d.main?.humidity ?? 0, windSpeed: Math.round((d.wind?.speed ?? 0) * 3.6),
    description: d.weather?.[0]?.description || '', icon: '\u26C5', forecast: [],
  };
}));

api.get('/games', route(async () => {
  const k = key('RAWG_KEY');
  const d = await getJson(`https://api.rawg.io/api/games?key=${encodeURIComponent(k)}&ordering=-rating&page_size=20`);
  const year = new Date().getFullYear();
  return (d.results || []).map(g => ({
    id: g.id, name: g.name, rating: Math.round((g.rating || 0) * 20) / 10,
    genres: (g.genres || []).map(x => x.name).slice(0, 2), released: (g.released || '').slice(0, 4),
    emoji: '\u{1F3AE}', bgColor: '#1a1a2e', isNew: (g.released || '').startsWith(String(year)),
  }));
}));

api.get('/movies', route(async () => {
  const k = key('TMDB_KEY');
  const d = await getJson(`https://api.themoviedb.org/3/movie/popular?api_key=${encodeURIComponent(k)}&language=pt-BR`);
  return (d.results || []).map(m => ({
    id: m.id, title: m.title, overview: m.overview || '', genre: 'Popular',
    year: Number((m.release_date || '').slice(0, 4)) || 0, rating: Math.round((m.vote_average || 0) * 10) / 10,
    emoji: '\u{1F3AC}', bgColor: '#101020',
  }));
}));

api.get('/rates', route(async () => {
  // Endpoint aberto (sem chave) da ExchangeRate-API
  const d = await getJson('https://open.er-api.com/v6/latest/USD');
  if (d.result !== 'success') throw new HttpError(502, 'API de cambio retornou erro');
  const r = d.rates || {};
  const out = {};
  for (const c of ['USD', 'EUR', 'BRL', 'GBP', 'JPY', 'ARS']) if (r[c] != null) out[c] = r[c];
  return out;
}));

api.get('/quotes', route(async () => {
  const d = await getJson('https://zenquotes.io/api/quotes');
  if (!Array.isArray(d)) throw new HttpError(502, 'resposta inesperada do zenquotes');
  return d.filter(q => q.q && q.a).slice(0, 20).map(q => ({ text: q.q, author: q.a }));
}));

app.use('/api', api);
app.use((req, res) => res.status(404).json({ error: 'rota nao encontrada' }));

app.listen(PORT, '127.0.0.1', () => console.log(`PortalBR proxy em http://127.0.0.1:${PORT}/api`));