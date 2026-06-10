import * as Location from 'expo-location';
import { Coordinates } from '../types';

const DEFAULT_COORDS: Coordinates = {
  latitude: 48.8566,
  longitude: 2.3522,
};

export async function getCurrentLocation(): Promise<Coordinates | null> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      console.warn('Permission de géolocalisation refusée');
      return DEFAULT_COORDS;
    }

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (locationError) {
      console.warn('Erreur lors de la récupération de la géolocalisation, utilisation du fallback:', locationError);
      return DEFAULT_COORDS;
    }
  } catch (error) {
    console.warn('Erreur lors de la gestion des permissions, utilisation du fallback:', error);
    return DEFAULT_COORDS;
  }
}

export async function getLocationName(
  coords: Coordinates
): Promise<{ city: string; country: string } | null> {
  try {
    const results = await Location.reverseGeocodeAsync(coords);

    if (results.length > 0) {
      const location = results[0];
      return {
        city: location.city || location.name || 'Position actuelle',
        country: location.country || '',
      };
    }

    return {
      city: 'Position actuelle',
      country: '',
    };
  } catch (error) {
    console.warn('Erreur lors du géocodage inverse, utilisation du fallback:', error);
    return {
      city: 'Position actuelle',
      country: '',
    };
  }
}
