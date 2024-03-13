import 'react-native-gesture-handler';
import FlashMessage from "react-native-flash-message";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import Routes from "./src/routes/Routes";
import { firebase } from "./firebase";
import { useState, useEffect } from "react";
import { View, Text, StyleSheet } from 'react-native';


export default function App() {
  const auth = firebase.getAuth();

  const [currentUser, setCurrentUser] = useState(auth?.currentUser);
  const [initializing, setInitializing] = useState(true);


  const onAuthStateChangedHandler = (user) => {
    setCurrentUser(user);
    if (initializing) {
      setInitializing(false);
    }
  };

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(onAuthStateChangedHandler);

		return unsubscribe;
	}, []);

  if (initializing) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ActionSheetProvider>
			<>
				<Routes user={currentUser} />
				<FlashMessage position="top" />
			</>
		</ActionSheetProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});