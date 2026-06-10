import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Star } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { getWeatherIcon, getWeatherData } from '../../services/weatherService';
import { formatTime, formatDateTime, getWindDirection } from '../../utils/formatters';
import { useEffect, useMemo, useState } from 'react';
import { CityWeather } from '../../types';

export default function DetailsScreen() {
  const router = useRouter();
  const { id, lat, lon, name, country, timezone } = useLocalSearchParams<{
    id: string;
    lat?: string;
    lon?: string;
    name?: string;
    country?: string;
    timezone?: string;
  }>();
  const { favoriteCities, currentLocation, saveFavorite, removeFromFavorites } = useWeather();

  const [localCity, setLocalCity] = useState<CityWeather | null>(null);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const contextCity = useMemo(() => {
    if (id === currentLocation?.id) return currentLocation;
    return favoriteCities.find((c) => c.id === id) ?? null;
  }, [id, favoriteCities, currentLocation]);

  useEffect(() => {
    if (!contextCity && lat && lon) {
      setLocalLoading(true);
      setLocalError(null);
      getWeatherData({ latitude: parseFloat(lat), longitude: parseFloat(lon) })
        .then((weather) => {
          setLocalCity({
            id: id ?? `${lat}-${lon}`,
            name: name ?? 'Ville',
            country: country ?? '',
            latitude: parseFloat(lat),
            longitude: parseFloat(lon),
            timezone: timezone ?? 'UTC',
            weather,
            isFavorite: false,
            lastUpdated: new Date().toISOString(),
          });
        })
        .catch((err) => {
          setLocalError(err instanceof Error ? err.message : 'Erreur de chargement');
        })
        .finally(() => setLocalLoading(false));
    }
  }, [contextCity, lat, lon]);

  const city = contextCity ?? localCity;
  const isFavorite = favoriteCities.some((c) => c.id === city?.id);

  const toggleFavorite = async () => {
    if (!city) return;
    if (isFavorite) {
      await removeFromFavorites(city.id);
    } else {
      await saveFavorite(city);
    }
  };

  if (localLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      </SafeAreaView>
    );
  }

  if (localError || (!city && !localLoading)) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ChevronLeft size={24} color="#fff" />
            <Text style={styles.backText}>Retour</Text>
          </TouchableOpacity>
          <Text style={styles.errorText}>{localError ?? 'Ville non trouvée'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!city) return null;

  const weather = city.weather;
  const current = weather.current;
  const daily = weather.daily;
  const windDirection = getWindDirection(current.wind_direction);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* En-tête */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ChevronLeft size={24} color="#fff" />
            <Text style={styles.backText}>Retour</Text>
          </TouchableOpacity>
        </View>

        {/* Info principale */}
        <View style={styles.mainInfo}>
          <Text style={styles.cityName}>{city.name}</Text>
          <Text style={styles.country}>{city.country}</Text>
        </View>

        {/* Météo actuelle */}
        <View style={styles.currentWeather}>
          <Text style={styles.largeIcon}>{getWeatherIcon(current.weather_code)}</Text>
          <Text style={styles.largeTemperature}>{Math.round(current.temperature)}°</Text>
          <Text style={styles.description}>{current.weather_description}</Text>
          <Text style={styles.feelsLike}>
            Ressenti : {Math.round(current.apparent_temperature)}°
          </Text>
        </View>

        {/* Détails météo */}
        <Text style={styles.sectionTitle}>DÉTAILS MÉTÉO</Text>
        <View style={styles.detailsGrid}>
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Min / Max</Text>
            <Text style={styles.detailValue}>
              {Math.round(daily.temperature_min[0])}° / {Math.round(daily.temperature_max[0])}°
            </Text>
          </View>

          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Humidité</Text>
            <Text style={styles.detailValue}>{current.relative_humidity}%</Text>
          </View>

          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Vent</Text>
            <Text style={styles.detailValue}>{Math.round(current.wind_speed)} km/h</Text>
          </View>

          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Direction</Text>
            <Text style={styles.detailValue}>{windDirection}</Text>
          </View>

          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Pression</Text>
            <Text style={styles.detailValue}>{Math.round(current.pressure_msl)} hPa</Text>
          </View>

          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Pluie</Text>
            <Text style={styles.detailValue}>{current.precipitation.toFixed(1)} mm</Text>
          </View>

          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Lever du soleil</Text>
            <Text style={styles.detailValue}>{formatTime(current.sunrise)}</Text>
          </View>

          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Coucher du soleil</Text>
            <Text style={styles.detailValue}>{formatTime(current.sunset)}</Text>
          </View>
        </View>

        {/* Date de mise à jour */}
        <View style={styles.updateInfo}>
          <Text style={styles.updateLabel}>
            Dernière mise à jour : {formatDateTime(city.lastUpdated)}
          </Text>
        </View>

        {/* Bouton favori */}
        <TouchableOpacity
          style={[styles.favButton, isFavorite && styles.favButtonActive]}
          onPress={toggleFavorite}
        >
          <Star size={18} color={isFavorite ? '#FFD700' : '#fff'} fill={isFavorite ? '#FFD700' : 'none'} />
          <Text style={[styles.favButtonText, isFavorite && styles.favButtonTextActive]}>
            {isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#001a4d',
  },
  container: {
    flex: 1,
    backgroundColor: '#001a4d',
    paddingHorizontal: 16,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '600',
  },
  mainInfo: {
    marginBottom: 24,
  },
  cityName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  country: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 4,
  },
  currentWeather: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    paddingVertical: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  largeIcon: {
    fontSize: 72,
    marginBottom: 12,
  },
  largeTemperature: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#fff',
  },
  description: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
  },
  feelsLike: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: 1,
    marginBottom: 12,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  detailCard: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  detailLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 6,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  updateInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 24,
  },
  updateLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    textAlign: 'center',
  },
  favButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    gap: 8,
  },
  favButtonActive: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderColor: 'rgba(255, 215, 0, 0.4)',
  },
  favButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  favButtonTextActive: {
    color: '#FFD700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 24,
  },
});
