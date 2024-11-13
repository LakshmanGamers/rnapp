import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { AuthContext } from '../AuthContext';

const RegisterScreen = ({ navigation }) => {
  const { register } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    const result = await register(email, password);
    if (!result || result.error) {
      setError('Registration failed');
    } else {
      navigation.navigate('Login');
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://source.unsplash.com/random/800x600/?abstract,gradient' }}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Create Account</Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#ccc"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>Already have an account? Log in</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    resizeMode: 'cover', // Ensures the background image covers the screen properly
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // Semi-transparent white for input fields and buttons
    borderRadius: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#3E4A89', // Consistent color as LoginScreen
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    width: '80%',
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Same input field background as LoginScreen
    borderRadius: 25,
    paddingHorizontal: 16,
    marginVertical: 10,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
  registerButton: {
    backgroundColor: '#3E4A89', // Consistent with Login button
    borderRadius: 25,
    width: '80%',
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  loginText: {
    color: '#3E4A89', // Same color as title for a consistent look
    marginTop: 20,
    fontSize: 16,
  },
});

export default RegisterScreen;
