import {
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { firebase } from "../../firebase";

import { showMessage } from "react-native-flash-message";
import { useState } from "react";

const auth = firebase.getAuth();

const NewCategory = ({ navigation }) => {
	const user = auth.currentUser;

	const [name, setName] = useState("");
	const [limit, setLimit] = useState("");

	const usersCollectionRef = []; //collection(db, "users", user?.uid, "categories");

	const createCategory = async () => {
		if (!(name.trim().length > 0 && limit.trim().length > 0)) {
			showMessage({
				message: "Please complete all fields",
				type: "danger",
			});
			return;
		}

		if (isNaN(parseFloat(limit)) || parseFloat(limit) <= 0.0) {
			showMessage({
				message: "Limit must be a number greater than 0",
				type: "danger",
			});
			return;
		}

		const docRef = await addDoc(usersCollectionRef, {
			name,
			limit: parseFloat(limit),
		});

		await updateDoc(docRef, { id: docRef.id });
		navigation.goBack();
	};

	return (
		<View style={styles.container}>
			<View style={styles.form}>
				<TextInput
					style={styles.input}
					placeholder="Category name"
					onChangeText={setName}
					maxLength={30}
				/>

				<TextInput
					style={styles.input}
					placeholder="Limit"
					onChangeText={setLimit}
					keyboardType={"numeric"}
					maxLength={6}
				/>

				<TouchableOpacity
					onPress={async () => {
						await createCategory(name, limit);
					}}>
					<View style={styles.button}>
						<Text style={styles.buttonText}>Add</Text>
					</View>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default NewCategory;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#ffffff",
		alignItems: "center",
	},

	input: {
		justifyContent: "center",
		backgroundColor: "#F6F6F6",
		height: 50,
		padding: 16,
		marginBottom: 16,
		borderWidth: 1,
		borderColor: "#E8E8E8",
		borderRadius: 8,
	},

	tinyLogo: {
		width: 30,
		height: 30,
	},

	form: {
		alignSelf: "stretch",
		marginTop: 32,
		marginLeft: 16,
		marginRight: 16,
	},

	button: {
		marginTop: 32,
		alignItems: "center",
		paddingTop: 16,
		paddingBottom: 16,
		borderRadius: 100,
		backgroundColor: "#74CA8D",
	},

	buttonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "600",
	},
	link_color: {
		color: "#5DB075",
		marginBottom: 10,
		marginLeft: 200,
	},
});
