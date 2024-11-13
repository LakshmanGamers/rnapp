import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { BarCodeScanner } from "expo-barcode-scanner";
import {
  Button,
  ActivityIndicator,
  Appbar,
  Card,
  Paragraph,
} from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect

export default function QRScannerApp() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [isValidQR, setIsValidQR] = useState(null); // Holds the validity of the QR
  const [qrData, setQrData] = useState({}); // Holds the actual scanned QR data

  // Request camera permission when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const requestPermission = async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === "granted");
      };
      requestPermission();
    }, [])
  );

  const addInDB = async (data) => {
    try {
      const result = await axios.post("http://192.168.1.15:5000/add_history", {
        data: data,
      });
    } catch (err) {
      Alert.alert(err.message);
    }
  };

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    try {
      const qrDataParsed = JSON.parse(data); // Parse the QR code data
      setQrData(qrDataParsed); // Store the parsed QR data
      addInDB(qrDataParsed);
      // Check the 'status' field in the parsed data
      setIsValidQR(qrDataParsed.status);
    } catch (error) {
      setIsValidQR(false); // If parsing fails, mark as invalid
    }
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator animating={true} size="large" />
        <Text style={styles.loadingText}>Requesting camera permission...</Text>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text>No access to camera</Text>
      </SafeAreaView>
    );
  }

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Paragraph style={styles.instructionText}>
            Point your camera at the QR code to scan it.
          </Paragraph>
        </Card.Content>
      </Card>

      <View style={styles.barcodeScannerWrapper}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      </View>

      {/* Display validation result when scanned */}
      {scanned && (
        <View style={styles.resultWrapper}>
          {isValidQR === true ? (
            <>
              <MaterialIcons name="check-circle" size={60} color="green" />
              <Text style={styles.successText}>Success</Text>
            </>
          ) : (
            <>
              <MaterialIcons name="cancel" size={60} color="red" />
              <Text style={styles.errorText}>Failed</Text>
            </>
          )}

          {/* Display formatted data */}
          <View style={styles.dataContainer}>
            <Text style={styles.dataText}>
              Currency Value: {qrData.currencyValue}
            </Text>

            <Text style={styles.dataText}>
              Last Scanned Date: {formatDate(qrData.lastScannedDate)}
            </Text>
          </View>

          <Button
            mode="contained"
            onPress={() => {
              setScanned(false); // Reset the scanner to scan again
              setQrData({}); // Clear the QR data display
              setIsValidQR(null); // Reset QR validity state
            }}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Scan Again
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  barcodeScannerWrapper: {
    flex: 1,
    margin: 20,
    borderRadius: 10,
    overflow: "hidden",
    elevation: 5, // Android shadow equivalent
    backgroundColor: "#f5f5f5",
  },
  resultWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  successText: {
    fontSize: 18,
    color: "green",
    marginTop: 10,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    marginTop: 10,
  },
  dataContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  dataText: {
    fontSize: 16,
    color: "#555",
    marginVertical: 5,
    paddingHorizontal: 20,
    textAlign: "center",
  },
  button: {
    marginTop: 20,
    marginHorizontal: 40,
    borderRadius: 10,
    elevation: 2, // For Android shadow
  },
  buttonContent: {
    paddingVertical: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#777",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    margin: 20,
    elevation: 3, // For Android shadow
  },
  instructionText: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
  },
});
