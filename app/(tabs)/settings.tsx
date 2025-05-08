import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Platform,
  Linking,
} from "react-native";
import { theme } from "@/styles/theme";
import { BUSINESS_CATEGORIES } from "@/utils/ideaGenerator";
import {
  Sun,
  Moon,
  Info,
  Heart,
  Share as ShareIcon,
  Trash,
  LogOutIcon,
} from "lucide-react-native";
import { useIdeas } from "@/context/IdeaContext";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsScreen() {
  // Settings state
  const [darkMode, setDarkMode] = React.useState(false);
  const { ideas, removeIdea } = useIdeas();
  const router = useRouter();

  // Handle dark mode toggle (mock functionality)
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);

    // Show alert that this is just a mock
    if (Platform.OS !== "web") {
      Alert.alert(
        "Feature Preview",
        "Dark mode is coming in a future update!",
        [{ text: "OK" }]
      );
    } else {
      alert("Dark mode is coming in a future update!");
    }
  };

  const handleLogout = async () => {
    // logout user
    try {
      await AsyncStorage.removeItem("authToken");
      router.push("/Login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };
  // Handle clear all data
  const handleClearData = () => {
    const confirmClear = () => {
      // Remove all ideas
      ideas.forEach((idea) => removeIdea(idea.id));
    };

    if (Platform.OS !== "web") {
      Alert.alert(
        "Clear All Data",
        "Are you sure you want to delete all your ideas? This action cannot be undone.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Clear All", onPress: confirmClear, style: "destructive" },
        ]
      );
    } else {
      if (
        window.confirm(
          "Are you sure you want to delete all your ideas? This action cannot be undone."
        )
      ) {
        confirmClear();
      }
    }
  };

  // Handle about app (mock functionality)
  const handleAboutApp = () => {
    if (Platform.OS !== "web") {
      Alert.alert(
        "About IdeaSticky",
        "IdeaSticky v1.0.0\nA business idea generator app that helps entrepreneurs find their next project.\n\nDeveloped with ❤️ using React Native and Expo.",
        [{ text: "Close" }]
      );
    } else {
      alert(
        "IdeaSticky v1.0.0\nA business idea generator app that helps entrepreneurs find their next project.\n\nDeveloped with ❤️ using React Native and Expo."
      );
    }
  };

  // Handle rate app (mock functionality)
  const handleRateApp = () => {
    if (Platform.OS !== "web") {
      Alert.alert(
        "Rate IdeaSticky",
        "This feature will be available once the app is published on app stores.",
        [{ text: "OK" }]
      );
    } else {
      alert("Rate functionality will be available once the app is published.");
    }
  };

  // Handle share app (mock functionality)
  const handleShareApp = () => {
    if (Platform.OS !== "web") {
      Alert.alert(
        "Share IdeaSticky",
        "This feature will be available once the app is published.",
        [{ text: "OK" }]
      );
    } else {
      alert("Share functionality will be available once the app is published.");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* App Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.appTitle}>IdeaSticky</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.appDescription}>
            Your pocket business idea generator for entrepreneurs.
          </Text>
        </View>

        {/* Settings Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Display</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLabelContainer}>
              {darkMode ? (
                <Moon
                  size={22}
                  color={theme.colors.text}
                  style={styles.settingIcon}
                />
              ) : (
                <Sun
                  size={22}
                  color={theme.colors.text}
                  style={styles.settingIcon}
                />
              )}
              <Text style={styles.settingLabel}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: "#D1D1D6", true: theme.colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Categories</Text>
          {BUSINESS_CATEGORIES.map((category) => (
            <View key={category} style={styles.categoryItem}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <TouchableOpacity style={styles.actionItem} onPress={handleAboutApp}>
            <Info
              size={20}
              color={theme.colors.text}
              style={styles.actionIcon}
            />
            <Text style={styles.actionText}>About IdeaSticky</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} onPress={handleRateApp}>
            <Heart
              size={20}
              color={theme.colors.text}
              style={styles.actionIcon}
            />
            <Text style={styles.actionText}>Rate the App</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} onPress={handleShareApp}>
            <ShareIcon
              size={20}
              color={theme.colors.text}
              style={styles.actionIcon}
            />
            <Text style={styles.actionText}>Share with Friends</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>

          <TouchableOpacity style={styles.actionItem} onPress={handleClearData}>
            <Trash
              size={20}
              color={theme.colors.error}
              style={styles.actionIcon}
            />
            <Text style={[styles.actionText, styles.dangerText]}>
              Clear All Data
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.actionItem} onPress={handleLogout}>
          <LogOutIcon
            size={20}
            color={theme.colors.error}
            style={styles.actionIcon}
          />
          <Text style={[styles.actionText, styles.actionText]}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  infoSection: {
    alignItems: "center",
    marginBottom: 32,
    marginTop: 8,
  },
  appTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 28,
    color: theme.colors.primary,
    marginBottom: 4,
  },
  appVersion: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  appDescription: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: theme.colors.text,
    textAlign: "center",
    maxWidth: 300,
  },
  section: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    marginBottom: 24,
    overflow: "hidden",
    ...theme.shadows.sm,
  },
  sectionTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 16,
    color: theme.colors.text,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  settingLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingIcon: {
    marginRight: 12,
  },
  settingLabel: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: theme.colors.text,
  },
  categoryItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  categoryText: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: theme.colors.text,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  actionIcon: {
    marginRight: 12,
  },
  actionText: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: theme.colors.text,
  },
  dangerText: {
    color: theme.colors.error,
  },
  footnote: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: 24,
    marginBottom: 32,
  },
});
