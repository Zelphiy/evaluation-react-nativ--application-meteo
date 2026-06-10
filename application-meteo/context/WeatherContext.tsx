import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { CityWeather, SearchResult } from '../types';
import * as weatherService from '../services/weatherService';
import * as locationService from '../services/locationService';
import * as storageService from '../services/storageService';

interface WeatherContextType {
  currentLocation: CityWeather | null;
  favoriteCities: CityWeather[];
  searchResults: SearchResult[];
  loading: boolean;
  error: string | null;

  fetchCurrentLocationWeather: () => Promise<void>;
  searchCities: (query: string) => Promise<void>;
  saveFavorite: (city: CityWeather) => Promise<void>;
  removeFromFavorites: (id: string) => Promise<void>;
  clearSearch: () => void;
  clearError: () => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [currentLocation, setCurrentLocation] = useState<CityWeather | null>(null);
  const [favoriteCities, setFavoriteCities] = useState<CityWeather[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    storageService.getFavoriteCities()
      .then(setFavoriteCities)
      .catch((err) => console.error('Erreur lors du chargement des favoris:', err));
  }, []);

  const fetchCurrentLocationWeather = async () => {
    setLoading(true);
    setError(null);

    try {
      const coords = await locationService.getCurrentLocation();

      if (!coords) {
        throw new Error('Impossible de récupérer votre position');
      }

      try {
        await storageService.saveLastLocation(coords.latitude, coords.longitude);
      } catch (storageErr) {
        console.warn('Erreur sauvegarde localisation:', storageErr);
      }

      const locationName = await locationService.getLocationName(coords);

      const weatherData = await weatherService.getWeatherData(coords);

      const cityWeather: CityWeather = {
        id: `${coords.latitude}-${coords.longitude}`,
        name: locationName?.city || 'Ma position',
        country: locationName?.country || '',
        latitude: coords.latitude,
        longitude: coords.longitude,
        timezone: weatherData.timezone,
        weather: weatherData,
        isFavorite: await storageService.isCityFavorite(coords.latitude, coords.longitude),
        lastUpdated: new Date().toISOString(),
      };

      setCurrentLocation(cityWeather);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue lors du chargement météo';
      setError(message);
      console.error('Erreur lors du chargement météo:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchCities = async (query: string) => {
    setLoading(true);
    setError(null);

    try {
      const results = await weatherService.searchCities(query);
      setSearchResults(results);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur de recherche';
      setError(message);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const saveFavorite = async (city: CityWeather) => {
    try {
      const cityWithFav = { ...city, isFavorite: true };
      await storageService.addFavoriteCity(cityWithFav);
      setFavoriteCities((prev) => {
        if (prev.some((c) => c.id === city.id)) return prev;
        return [...prev, cityWithFav];
      });
      if (currentLocation && currentLocation.id === city.id) {
        setCurrentLocation({ ...currentLocation, isFavorite: true });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de l'ajout";
      setError(message);
    }
  };

  const removeFromFavorites = async (id: string) => {
    try {
      await storageService.removeFavoriteCity(id);

      setFavoriteCities(favoriteCities.filter((city) => city.id !== id));

      if (currentLocation && currentLocation.id === id) {
        setCurrentLocation({ ...currentLocation, isFavorite: false });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la suppression';
      setError(message);
    }
  };

  const clearSearch = () => {
    setSearchResults([]);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <WeatherContext.Provider
      value={{
        currentLocation,
        favoriteCities,
        searchResults,
        loading,
        error,
        fetchCurrentLocationWeather,
        searchCities,
        saveFavorite,
        removeFromFavorites,
        clearSearch,
        clearError,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);

  if (!context) {
    throw new Error('useWeather doit être utilisé dans un WeatherProvider');
  }

  return context;
}
