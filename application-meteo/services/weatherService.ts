import { OPEN_METEO_URL, OPEN_METEO_GEO_URL } from '../constants/config';
import { WeatherData, Coordinates, SearchResult } from '../types';

const WEATHER_DESCRIPTIONS: Record<number, string> = {
  0: 'Ciel dégagé',
  1: 'Principalement dégagé',
  2: 'Partiellement nuageux',
  3: 'Couvert',
  45: 'Brouillard',
  48: 'Brouillard givrant',
  51: 'Bruine légère',
  53: 'Bruine modérée',
  55: 'Bruine dense',
  61: 'Pluie légère',
  63: 'Pluie modérée',
  65: 'Pluie forte',
  71: 'Neige légère',
  73: 'Neige modérée',
  75: 'Neige forte',
  80: 'Averses légères',
  81: 'Averses modérées',
  82: 'Averses violentes',
  95: 'Orage',
  96: 'Orage avec grêle',
  99: 'Orage avec forte grêle',
};

const WEATHER_ICONS: Record<number, string> = {
  0: '☀️',
  1: '🌤️',
  2: '⛅',
  3: '☁️',
  45: '🌫️',
  48: '🌫️',
  51: '🌦️',
  53: '🌦️',
  55: '🌧️',
  61: '🌧️',
  63: '🌧️',
  65: '🌧️',
  71: '🌨️',
  73: '🌨️',
  75: '❄️',
  80: '🌦️',
  81: '🌧️',
  82: '⛈️',
  95: '⛈️',
  96: '⛈️',
  99: '⛈️',
};

export function getWeatherIcon(code: number): string {
  return WEATHER_ICONS[code] ?? '🌡️';
}

export function getWeatherDescription(code: number): string {
  return WEATHER_DESCRIPTIONS[code] ?? 'Météo inconnue';
}

export async function getWeatherData(coords: Coordinates): Promise<WeatherData> {
  const currentParams = [
    'temperature_2m',
    'relative_humidity_2m',
    'apparent_temperature',
    'weather_code',
    'wind_speed_10m',
    'wind_direction_10m',
    'surface_pressure',
    'precipitation',
    'is_day',
  ].join(',');

  const dailyParams = [
    'temperature_2m_max',
    'temperature_2m_min',
    'weather_code',
    'sunrise',
    'sunset',
  ].join(',');

  const url =
    `${OPEN_METEO_URL}?latitude=${coords.latitude}&longitude=${coords.longitude}` +
    `&current=${currentParams}` +
    `&daily=${dailyParams}` +
    `&timezone=auto&forecast_days=1`;

  const response = await fetch(url);
  if (!response.ok) throw new Error('Erreur lors de la récupération des données météo');
  const data = await response.json();

  const c = data.current;
  const d = data.daily;
  const code: number = c.weather_code;

  return {
    current: {
      temperature: c.temperature_2m,
      relative_humidity: c.relative_humidity_2m,
      apparent_temperature: c.apparent_temperature,
      weather_code: code,
      weather_description: getWeatherDescription(code),
      wind_speed: c.wind_speed_10m,
      wind_direction: c.wind_direction_10m,
      pressure_msl: c.surface_pressure,
      precipitation: c.precipitation,
      sunrise: d.sunrise[0],
      sunset: d.sunset[0],
      time: c.time,
    },
    daily: {
      temperature_max: d.temperature_2m_max,
      temperature_min: d.temperature_2m_min,
    },
    timezone: data.timezone,
  };
}

export async function searchCities(query: string): Promise<SearchResult[]> {
  const url = `${OPEN_METEO_GEO_URL}?name=${encodeURIComponent(query)}&count=5&language=fr&format=json`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Erreur réseau lors de la recherche');
  const data = await response.json();
  return (data.results ?? []).map((r: any) => ({
    id: r.id,
    name: r.name,
    country: r.country ?? '',
    admin1: r.admin1,
    latitude: r.latitude,
    longitude: r.longitude,
    timezone: r.timezone ?? 'UTC',
  }));
}
