export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface WeatherData {
  current: CurrentWeather;
  daily: DailyWeather;
  hourly?: HourlyWeather;
  timezone: string;
}

export interface CurrentWeather {
  temperature: number;
  relative_humidity: number;
  weather_code: number;
  weather_description: string;
  apparent_temperature: number;
  wind_speed: number;
  wind_direction: number;
  pressure_msl: number;
  precipitation: number;
  sunrise: string;
  sunset: string;
  time: string;
}

export interface DailyWeather {
  temperature_max: number[];
  temperature_min: number[];
}

export interface HourlyWeather {
  time: string[];
  temperature_2m: number[];
}

export interface City {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface CityWeather extends City {
  weather: WeatherData;
  isFavorite: boolean;
  lastUpdated: string;
}

export interface SearchResult {
  id: number;
  name: string;
  admin1?: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}
