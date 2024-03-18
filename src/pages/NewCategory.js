import {
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { firebase } from "../../firebase";
import { showMessage } from "react-native-flash-message";
import { useState } from "react";
import { addCategory } from "../redux/actions";
import { useSelector, useDispatch } from 'react-redux';


const NewCategory = ({ navigation }) => {
	const categories = useSelector((state) => state.categories);
	const dispatch = useDispatch();

	const [name, setName] = useState("");

	const createCategory = async (catName) => {
		if (!(catName.trim().length > 0)) {
			showMessage({
				message: "Please complete all fields",
				type: "danger",
			});
			return;
		}
		dispatch(
			addCategory({
				id: categories.length ? categories.length + 1 : 1,
				name: catName
			})
		);
		setName("");
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

				<TouchableOpacity
					onPress={() =>createCategory(name)}>
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
