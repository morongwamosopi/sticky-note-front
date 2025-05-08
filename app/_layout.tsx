import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
// import { SplashScreen } from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View } from 'react-native';
import { IdeaProvider } from '@/context/IdeaContext';

// Prevent splash screen from auto-hiding
// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-Bold': Inter_700Bold,
  });

  // Hide splash screen once fonts are loaded
  useEffect(() => {
    if (fontsLoaded || fontError) {
      // SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Return null to keep splash screen visible while fonts load
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <IdeaProvider>
        <Stack screenOptions={{ headerShown: false }}></Stack>
        <StatusBar style="auto" />
      </IdeaProvider>
    </GestureHandlerRootView>
  );
}
