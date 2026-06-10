import { ScrollView, Text, TextInput, View, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, ActivityIndicator, Pressable } from 'react-native';
import { Plus, Search, X } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useWeather } from '../context/WeatherContext';
import MyLoc from '../components/myLoc';
import MyFav from '../components/myFav';

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const { searchResults, favoriteCities, loading, searchCities, clearSearch } = useWeather();

  const handleSearch = async (text: string) => {
    setSearchQuery(text);

    if (text.length >= 2) {
      setShowResults(true);
      await searchCities(text);
    } else {
      setShowResults(false);
      clearSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setShowResults(false);
    clearSearch();
  };

  const handleSelectCity = (resultCity: any) => {
    const id = `${resultCity.latitude}-${resultCity.longitude}`;
    handleClearSearch();
    router.push({
      pathname: '/details/[id]',
      params: {
        id,
        lat: String(resultCity.latitude),
        lon: String(resultCity.longitude),
        name: resultCity.name,
        country: resultCity.country,
        timezone: resultCity.timezone ?? 'UTC',
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        scrollEnabled={!showResults}
        contentContainerStyle={!showResults ? { flexGrow: 1 } : {}}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Météo</Text>
          <Text style={styles.subtitle}>Vos villes en un coup d'œil</Text>
        </View>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color="rgba(255, 255, 255, 0.6)" />
            <TextInput
              placeholder="Rechercher une ville"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              onChangeText={handleSearch}
              value={searchQuery}
              style={styles.searchInput}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={handleClearSearch}>
                <X size={20} color="rgba(255, 255, 255, 0.6)" />
              </TouchableOpacity>
            )}
          </View>
          {showResults && (
            <View style={styles.resultsContainer}>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#fff" />
                </View>
              ) : searchResults.length > 0 ? (
                <FlatList
                  data={searchResults}
                  scrollEnabled={false}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.resultItem}
                      onPress={() => handleSelectCity(item)}
                    >
                      <View style={styles.resultContent}>
                        <Text style={styles.resultCityName}>{item.name}</Text>
                        <Text style={styles.resultCountry}>{item.country}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              ) : (
                <Text style={styles.noResults}>Aucune ville trouvée</Text>
              )}
            </View>
          )}
        </View>
        <MyLoc />
        {favoriteCities.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>VILLES FAVORITES</Text>
            <View style={styles.favList}>
              {favoriteCities.map((city) => (
                <MyFav key={city.id} city={city} />
              ))}
            </View>
          </>
        )}
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
  header: {
    marginTop: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 4,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 16,
    color: 'white',
    ...({ outlineStyle: "none" } as any)
  },
  resultsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginTop: 8,
    maxHeight: 300,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  resultContent: {
    flex: 1,
  },
  resultCityName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resultCountry: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginTop: 2,
  },
  noResults: {
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    paddingVertical: 16,
  },
  loadingContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 24,
    marginBottom: 12,
  },
  favList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
});