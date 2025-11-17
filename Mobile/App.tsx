import React from "react";
import { StatusBar, SafeAreaView, StyleSheet, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
        <Text
          style={{
            color: "#fff",
            fontSize: 24,
            textAlign: "center",
            marginTop: 40,
          }}
        >
          Teste Expo Renderizando!
        </Text>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
});

export default App;