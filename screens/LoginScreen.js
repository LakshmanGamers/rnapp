import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { AuthContext } from "../AuthContext";

const LoginScreen = ({ navigation }) => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    const result = await login(email, password);
    if (!result || !result.token) {
      //   setError('Invalid email or password.');
      navigation.navigate("Main");
    } else {
      navigation.navigate("Main");
    }
  };

  return (
    <ImageBackground
      source={{
        uri: "https://source.unsplash.com/random/800x600/?nature,abstract",
      }}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Welcome Back</Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
        />

        <TextInput
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          placeholder="Password"
          secureTextEntry
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.registerButton}>Register</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, justifyContent: "center", resizeMode: "cover" },
  container: {
    padding: 20,
    borderRadius: 8,
    marginHorizontal: 16,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    elevation: 5, // For Android shadow effect
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#3E4A89",
    marginBottom: 24,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  loginButton: {
    backgroundColor: "#3E4A89",
    paddingVertical: 10,
    borderRadius: 25,
    marginTop: 20,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  registerButton: {
    marginTop: 10,
    color: "#3E4A89",
    textAlign: "center",
    fontSize: 16,
  },
});

export default LoginScreen;
