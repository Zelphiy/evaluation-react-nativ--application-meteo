import AsyncStorage from '@react-native-async-storage/async-storage';
import { CityWeather } from '../types';

const FAVORITES_KEY = '@weather_app_favorites';
const LAST_LOCATION_KEY = '@weather_app_last_location';

export async function getFavoriteCities(): Promise<CityWeather[]> {
  try {
    const data = await AsyncStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erreur lors de la lecture des favoris:', error);
    return [];
  }
}

export async function addFavoriteCity(city: CityWeather): Promise<void> {
  try {
    const favorites = await getFavoriteCities();

    const exists = favorites.some(
      (fav) => fav.latitude === city.latitude && fav.longitude === city.longitude
    );

    if (!exists) {
      favorites.push(city);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  } catch (error) {
    console.error('Erreur lors de l\'ajout aux favoris:', error);
    throw error;
  }
}

export async function removeFavoriteCity(id: string): Promise<void> {
  try {
    const favorites = await getFavoriteCities();
    const filtered = favorites.filter((city) => city.id !== id);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Erreur lors de la suppression des favoris:', error);
    throw error;
  }
}

export async function isCityFavorite(latitude: number, longitude: number): Promise<boolean> {
  try {
    const favorites = await getFavoriteCities();
    return favorites.some(
      (city) => city.latitude === latitude && city.longitude === longitude
    );
  } catch (error) {
    console.error('Erreur lors de la vérification des favoris:', error);
    return false;
  }
}

export async function saveLastLocation(
  latitude: number,
  longitude: number
): Promise<void> {
  try {
    await AsyncStorage.setItem(
      LAST_LOCATION_KEY,
      JSON.stringify({ latitude, longitude })
    );
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la localisation:', error);
    throw error;
  }
}

export async function getLastLocation(): Promise<{
  latitude: number;
  longitude: number;
} | null> {
  try {
    const data = await AsyncStorage.getItem(LAST_LOCATION_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Erreur lors de la lecture de la localisation:', error);
    return null;
  }
}
