import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  View,
} from "react-native";
import { theme } from "@/styles/theme";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { http } from "@/utils/http";
import { styles } from "./Login"; // ensure your styles are merged correctly

export default function Register() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cellphone, setCellphone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegistration = async () => {
    if (
      !email ||
      !password ||
      !confirmPassword ||
      !firstName ||
      !lastName ||
      !cellphone
    ) {
      Alert.alert("Validation Error", "Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Validation Error", "Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await http.post("/users/register", {
        username: email,
        password,
        first_name: firstName,
        last_name: lastName,
        cellphone,
      });

      const { message, error } = response.data;

      if (message === "ok") {
        Alert.alert("Success", "Account created successfully.");
        router.replace("/Login");
      } else {
        Alert.alert("Registration Failed", error || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Animated.View entering={FadeInDown} style={styles.card}>
        <Text style={styles.title}>Create an Account</Text>

        <TextInput
          placeholder="First Name"
          placeholderTextColor="#999"
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          placeholder="Last Name"
          placeholderTextColor="#999"
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          placeholder="Cellphone"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
          style={styles.input}
          value={cellphone}
          onChangeText={setCellphone}
        />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#999"
          style={styles.input}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#999"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          placeholder="Confirm Password"
          placeholderTextColor="#999"
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handleRegistration}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Register</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.link}>
          Already have an account?{" "}
          <Text
            style={styles.linkText}
            onPress={() => router.navigate("/Login")}
          >
            Login
          </Text>
        </Text>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}
