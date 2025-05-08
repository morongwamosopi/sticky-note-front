// app/(auth)/_layout.tsx
import { theme } from "@/styles/theme";
import { Stack } from "expo-router";
import { StatusBar, useColorScheme } from "react-native";

export default function AuthLayout() {
  return (
    <>
      <StatusBar backgroundColor={theme.colors.primary} />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
