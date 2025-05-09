import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { theme } from "@/styles/theme";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { http } from "@/utils/http"; // assuming your axios instance is here
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const validateEmail = (text: string) => {
    setEmail(text);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(emailRegex.test(text) ? "" : "Invalid email format");
  };

  const validatePassword = (text: string) => {
    setPassword(text);
    // setPasswordError(
    //   text.length < 6 ? "Password must be at least 6 characters" : ""
    // );
  };

  const isFormValid = email && password && !emailError && !passwordError;

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        router.replace("/board"); // Navigate and replace the current screen
      }
    };

    checkToken();
  }, []);

  const handleLogin = async () => {
    if (!isFormValid) return;

    setLoading(true);

    try {
      const response = await http.post("/users/login", {
        username: email,
        password: password,
      });

      setLoading(false);
      const token = response.data?.token;

      if (token) {
        await AsyncStorage.setItem("authToken", token);
        // Navigate to dashboard or home
        router.push("/board");
      } else {
        const message =
          response?.data.message || "Login failed. Please try again.";
        Alert.alert("", response.data?.error);
      }
    } catch (error: any) {
      setLoading(false);
      const message =
        error.response?.error || "Login failed. Please try again.";
      Alert.alert("Error", message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Animated.View entering={FadeInDown} style={styles.card}>
        <Text style={styles.title}>Login</Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#999"
          style={[styles.input, emailError && styles.inputError]}
          value={email}
          onChangeText={validateEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <View
          style={[
            styles.input,
            passwordError && styles.inputError,
            { flexDirection: "row", alignItems: "center" },
          ]}
        >
          <TextInput
            placeholder="Password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={validatePassword}
            secureTextEntry={!isPasswordVisible}
            style={{ flex: 1, fontSize: 16 }}
          />
          <TouchableOpacity
            onPress={() => setIsPasswordVisible((prev) => !prev)}
          >
            <Feather
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={22}
              color="#666"
              style={{ paddingHorizontal: 8 }}
            />
          </TouchableOpacity>
        </View>
        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}

        <TouchableOpacity
          style={[
            styles.button,
            (!isFormValid || loading) && styles.buttonDisabled,
          ]}
          onPress={handleLogin}
          disabled={!isFormValid || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.link}>
          Don't have an account?{" "}
          <Text
            style={styles.linkText}
            onPress={() => router.push("/register")}
          >
            Signup
          </Text>
        </Text>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  inputError: {
    borderColor: "#ff4d4f",
  },
  errorText: {
    color: "#ff4d4f",
    fontSize: 13,
    marginBottom: 8,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  link: {
    textAlign: "center",
    color: "#555",
  },
  linkText: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
});
