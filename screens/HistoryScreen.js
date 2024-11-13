import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, RefreshControl } from "react-native";
import axios from "axios";

const BASE_URL = "http://192.168.1.15:5000"; // Ensure your backend is running on this IP

const History = () => {
  const [scannedData, setScannedData] = useState([]);
  const [refreshing, setRefreshing] = useState(false); // State to track the refresh status

  // Fetch data from the API
  const generateData = async () => {
    try {
      const response = await axios.get(BASE_URL + "/get_history");
      return response.data.data; // Assuming 'data' is the key containing the history
    } catch (error) {
      console.error("Error fetching data:", error);
      return []; // Return empty array in case of error
    }
  };

  // Effect to fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      const data = await generateData();
      setScannedData(data); // Update state with fetched data
    };

    fetchData(); // Call the function to fetch data
  }, []);

  // Function to handle pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    const data = await generateData();
    setScannedData(data); // Update state with new data
    setRefreshing(false); // Set refreshing to false after the data is loaded
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.status ? "Active" : "Inactive"}</Text>
      <Text style={styles.cell}>{item.currency_value}</Text>
      <Text style={styles.cell}>{item.uuid}</Text>
      <Text style={styles.cell}>{item.created_date}</Text>
      <Text style={styles.cell}>{item.last_scanned_date}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={scannedData}
        renderItem={renderItem}
        keyExtractor={(item) => item.uuid} // Use uuid as a unique key for each item
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing} // Bind to the refreshing state
            onRefresh={onRefresh} // Trigger data fetch when pulled to refresh
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20, // Adds padding to prevent overlap with the status bar
    paddingHorizontal: 15,
    backgroundColor: "#f5f5f5", // Light background color for better contrast
  },
  row: {
    flexDirection: "row",
    paddingVertical: 15, // Vertical padding for each row for a better look
    paddingHorizontal: 10,
    marginBottom: 10, // Spacing between rows
    backgroundColor: "#fff", // White background for each row
    borderRadius: 8, // Rounded corners for a cleaner look
    shadowColor: "#000", // Add shadow for a more modern look
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3, // For Android devices
  },
  cell: {
    flex: 1,
    fontSize: 16,
    textAlign: "center",
    color: "#333", // Dark text color for better readability
  },
  listContent: {
    paddingBottom: 20, // Bottom padding to ensure the last item isn't too close to the bottom
  },
});

export default History;
