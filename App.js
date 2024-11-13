import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthProvider } from "./AuthContext";
import { createDrawerNavigator } from "@react-navigation/drawer";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import QRScannerApp from "./screens/QRScannerApp";
import HistoryScreen from "./screens/HistoryScreen";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Define the Drawer navigator as a separate component
function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={QRScannerApp} />
      <Drawer.Screen name="History" component={HistoryScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          {/* Drawer Navigator is added here as a screen in the Stack Navigator */}
          <Stack.Screen name="Main" component={DrawerNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
