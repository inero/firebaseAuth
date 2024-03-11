import React from "react";
import { StyleSheet, View } from "react-native";
import Dashboard from "../exptra/Dashboard";

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Dashboard />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: 'white',
  },
});
