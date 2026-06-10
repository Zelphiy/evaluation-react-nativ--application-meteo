import { DarkTheme, DefaultTheme, ThemeProvider, Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{headerShown: false}}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="details/[id]" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
