import { DarkTheme, DefaultTheme, ThemeProvider, Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { WeatherProvider } from '../context/WeatherContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <WeatherProvider>
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="details/[id]" options={{ headerShown: false }} />
        </Stack>
      </WeatherProvider>
    </ThemeProvider>
  );
}
