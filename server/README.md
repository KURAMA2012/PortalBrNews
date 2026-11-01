# PortalBR — proxy de APIs

Backend leve (Node 18+ / Express) que guarda as chaves de API **no servidor** e repassa os dados ao Angular. Também resolve o bloqueio de CORS do zenquotes.

## Como rodar

```powershell
cd server
npm install
copy .env.example .env   # depois edite o .env e preencha as chaves
npm start                # ou: npm run dev (reinicia ao salvar)
```

O proxy sobe em `http://127.0.0.1:3333/api`. O front (`environment.ts` → `apiBase`) já aponta para lá.

Sem uma chave, a rota correspondente responde `503 {"error":"chave X nao configurada"}` e o front usa os dados mock.

## Rotas

| Rota | API | Chave |
|---|---|---|
| `GET /api/health` | — | — |
| `GET /api/news?category=tech\|world\|finance\|sports\|sci` | NewsAPI | `NEWSAPI_KEY` |
| `GET /api/weather?city=...` | OpenWeather | `OPENWEATHER_KEY` |
| `GET /api/games` | RAWG | `RAWG_KEY` |
| `GET /api/movies` | TMDB | `TMDB_KEY` |
| `GET /api/rates` | ExchangeRate-API (open.er-api.com) | sem chave |
| `GET /api/quotes` | ZenQuotes | sem chave |

## Onde pegar as chaves (planos gratuitos)

- NewsAPI: https://newsapi.org/register (o plano free só funciona em localhost)
- OpenWeather: https://home.openweathermap.org/users/sign_up
- RAWG: https://rawg.io/apidocs
- TMDB: https://www.themoviedb.org/settings/api (use a "API Key (v3)")
- ExchangeRate-API: https://www.exchangerate-api.com (opcional; o câmbio já usa o endpoint aberto sem chave)

## Segurança

- Chaves só no `server/.env` (no `.gitignore`); nunca vão para o front nem para os logs.
- `helmet`, CORS restrito a `ALLOWED_ORIGIN` (várias origens separadas por vírgula), rate limit de 60 req/min por IP.
- Escuta só em `127.0.0.1`; `city` validada e codificada, `category` em whitelist; timeout de 8 s; erros genéricos sem detalhes internos.