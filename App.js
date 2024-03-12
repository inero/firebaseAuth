import 'react-native-gesture-handler';
import FlashMessage from "react-native-flash-message";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import Routes from "./src/routes/Routes";
import { firebase } from "./firebase";
import { useState, useEffect } from "react";



export default function App() {
  const auth = firebase.getAuth();
  
  const [currentUser, setCurrentUser] = useState(auth?.currentUser);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
		  if (user) {
			  setCurrentUser(user);
		  }
		});
		return unsubscribe;
	}, []);

  return (
    <ActionSheetProvider>
			<>
				<Routes user={currentUser} />
				<FlashMessage position="top" />
			</>
		</ActionSheetProvider>
  );
}