import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { getWeatherIcon } from '../services/weatherService';
import { useRouter } from 'expo-router';
import { CityWeather } from '../types';

interface MyFavProps {
  city: CityWeather;
}

export default function MyFav({ city }: MyFavProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: '/details/[id]',
      params: { id: city.id },
    });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.content}>
        <View style={styles.textContent}>
          <Text style={styles.cityName}>{city.name}</Text>
          <Text style={styles.description}>
            {city.weather.current.weather_description}
          </Text>
        </View>
        <Text style={styles.icon}>
          {getWeatherIcon(city.weather.current.weather_code)}
        </Text>
      </View>
      <Text style={styles.temperature}>
        {Math.round(city.weather.current.temperature)}°
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    flexBasis: '48%',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  textContent: {
    flex: 1,
  },
  cityName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginTop: 2,
  },
  icon: {
    fontSize: 32,
    marginLeft: 8,
  },
  temperature: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});