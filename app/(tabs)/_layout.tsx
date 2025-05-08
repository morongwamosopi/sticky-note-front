import { Tabs } from "expo-router";
import { Platform } from "react-native";
import {
  BrainCircuit,
  Bookmark,
  Settings,
  LightbulbIcon,
} from "lucide-react-native";
import { theme } from "@/styles/theme";
import { StatusBar } from "expo-status-bar";

export default function TabLayout() {
  return (
    <>
      <StatusBar backgroundColor={theme.colors.primary} />
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: theme.colors.background,
            borderTopColor: theme.colors.border,
            height: Platform.OS === "ios" ? 85 : 65,
            paddingBottom: Platform.OS === "ios" ? 25 : 5,
            paddingTop: 5,
            elevation: 0,
            shadowOpacity: 0,
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textSecondary,
          tabBarLabelStyle: {
            fontFamily: "Inter-Medium",
            fontSize: 12,
            marginTop: -5,
          },
          tabBarHideOnKeyboard: true,
          headerStyle: {
            backgroundColor: theme.colors.background,
            borderBottomWidth: 0,
            shadowOpacity: 0,
            elevation: 0,
          },
          headerTitleStyle: {
            fontFamily: "Inter-Bold",
            fontSize: 18,
            color: theme.colors.text,
          },
          headerTitleAlign: "center",
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Generate",
            tabBarIcon: ({ size, color }) => (
              <LightbulbIcon size={size} color={color} />
            ),
            headerTitle: "IdeaSticky",
          }}
        />
        <Tabs.Screen
          name="board"
          options={{
            title: "Board",
            tabBarIcon: ({ size, color }) => (
              <BrainCircuit size={size} color={color} />
            ),
            headerTitle: "Idea Board",
          }}
        />
        <Tabs.Screen
          name="favorites"
          options={{
            title: "Favorites",
            tabBarIcon: ({ size, color }) => (
              <Bookmark size={size} color={color} />
            ),
            headerTitle: "Favorite Ideas",
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ size, color }) => (
              <Settings size={size} color={color} />
            ),
            headerTitle: "Settings",
          }}
        />
      </Tabs>
    </>
  );
}
