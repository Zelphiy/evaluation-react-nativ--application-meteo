import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { MapPin, RotateCw } from 'lucide-react';
import { useEffect } from 'react';
import { useWeather } from '../context/WeatherContext';
import { getWeatherIcon } from '../services/weatherService';
import { useRouter } from 'expo-router';

export default function MyLoc() {
  const { currentLocation, loading, error, fetchCurrentLocationWeather } = useWeather();
  const router = useRouter();

  useEffect(() => {
    fetchCurrentLocationWeather();
  }, []);

  const handlePress = () => {
    if (currentLocation) {
      router.push({
        pathname: '/details/[id]',
        params: { id: currentLocation.id },
      });
    }
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={fetchCurrentLocationWeather}
        >
          <RotateCw size={20} color="#fff" />
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!currentLocation) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Données non disponibles</Text>
      </View>
    );
  }

  const { weather, name, country } = currentLocation;

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.header}>
        <MapPin size={20} color="#fff" />
        <Text style={styles.headerText}>Ma position</Text>
      </View>

      <Text style={styles.location}>
        {name}, {country}
      </Text>

      <View style={styles.weatherInfo}>
        <View style={styles.textContent}>
          <Text style={styles.temperature}>
            {Math.round(weather.current.temperature)}°C
          </Text>
          <Text style={styles.description}>{weather.current.weather_description}</Text>
          <Text style={styles.feelsLike}>
            Ressenti: {Math.round(weather.current.apparent_temperature)}°C
          </Text>
        </View>

        <View style={styles.iconContent}>
          <Text style={styles.weatherIcon}>
            {getWeatherIcon(weather.current.weather_code)}
          </Text>
        </View>
      </View>

      <View style={styles.minMaxContainer}>
        <View style={styles.minMax}>
          <Text style={styles.label}>Min</Text>
          <Text style={styles.value}>{Math.round(weather.daily.temperature_min[0])}°</Text>
        </View>
        <View style={styles.minMax}>
          <Text style={styles.label}>Max</Text>
          <Text style={styles.value}>{Math.round(weather.daily.temperature_max[0])}°</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginVertical: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '600',
  },
  location: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginBottom: 12,
  },
  weatherInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  textContent: {
    flex: 1,
  },
  temperature: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  description: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    marginVertical: 4,
  },
  feelsLike: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  iconContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  weatherIcon: {
    fontSize: 56,
  },
  minMaxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  minMax: {
    alignItems: 'center',
  },
  label: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
    marginBottom: 4,
  },
  value: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: '#ff6b6b',
    fontSize: 14,
    marginBottom: 10,
  },
  retryButton: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
  },
});