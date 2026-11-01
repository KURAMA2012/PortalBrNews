// ===== NEWS =====
export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  source: { name: string };
  category: 'tech' | 'world' | 'finance' | 'sports' | 'sci';
  emoji: string;
}

// ===== WEATHER =====
export interface WeatherData {
  city: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  forecast: ForecastDay[];
}

export interface ForecastDay {
  day: string;
  emoji: string;
  high: number;
  low: number;
}

// ===== GAMES =====
export interface Game {
  id: number;
  name: string;
  rating: number;
  genres: string[];
  released: string;
  emoji: string;
  bgColor: string;
  isNew?: boolean;
}

// ===== MOVIES =====
export interface Movie {
  id: number;
  title: string;
  overview: string;
  genre: string;
  year: number;
  rating: number;
  emoji: string;
  bgColor: string;
}

// ===== CRYPTO =====
export interface CryptoAsset {
  id: string;
  name: string;
  symbol: string;
  priceUsd: number;
  priceBrl: number;
  change24h: number;
  marketCap: string;
  emoji: string;
}

// ===== MEME =====
export interface Meme {
  id: string;
  name: string;
  url: string;
  emoji: string;
}

// ===== FACT =====
export interface Fact {
  number: string;
  text: string;
}

// ===== QUOTE =====
export interface Quote {
  text: string;
  author: string;
}
