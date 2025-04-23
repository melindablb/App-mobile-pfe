import React from "react";
import { View, Text, StyleSheet } from "react-native";


export default function Settings(): JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.Text}>Page des Paramètres</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F05050",
    justifyContent: "center",
    alignItems: "center",
  },
  Text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
});
