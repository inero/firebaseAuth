import {
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import {
	Timestamp,
	addDoc,
	collection,
	orderBy,
	query,
	updateDoc,
} from "firebase/firestore";
import { firebase } from "../../firebase";

import DateTimePicker from "@react-native-community/datetimepicker";
import Ionicons from "react-native-vector-icons/Ionicons";
import RNPickerSelect from "react-native-picker-select";
import { StatusBar } from "expo-status-bar";
import { showMessage } from "react-native-flash-message";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useState } from "react";

const grayPlaceholder = Platform.OS === "ios" ? "#bebec0" : "#a3a3a3";

// function that takes a date and returns its string value in format dd/mm/yyyy
function formatDate(date) {
	const day = date.getDate();
	const month = date.getMonth() + 1;
	const year = date.getFullYear();
	return `${day < 10 ? "0" + day : day}/${
		month < 10 ? "0" + month : month
	}/${year}`;
}

const auth = firebase.getAuth();

const NewExpense = ({ navigation }) => {
	const user = auth?.currentUser;

	const [category, setCategory] = useState("");
	const [expense, setExpense] = useState("");
	const [amount, setAmount] = useState("");

	const [date, setDate] = useState(new Date());
	const [show, setShow] = useState(false);

	const usersCollectionRef = []; //collection(db, "users", user.uid, "expenses");

	const createExpense = async () => {
		if (
			!(
				category.trim().length > 0 &&
				expense.trim().length > 0 &&
				amount.trim().length > 0
			)
		) {
			showMessage({
				message: "Please fill all fields",
				type: "danger",
			});
			return;
		}

		if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0.0) {
			showMessage({
				message: "The amount must be a number greater than 0",
				type: "danger",
			});
			return;
		}

		await addDoc(usersCollectionRef, {
			nom: expense,
			amount: parseFloat(amount),
			category,
			date: Timestamp.fromDate(date),
		}).then(async (docRef) => {
			await updateDoc(docRef, { id: docRef.id });
			showMessage({
				message: "Expense added successfully!",
				type: "success",
			});
		});
	};

	const [categories, loading, error] = [];
	// useCollectionData(
	// 	query(
	// 		collection(db, "users", user.uid, "categories"),
	// 		orderBy("nom", "asc")
	// 	)
	// );

	return (
		<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
			<KeyboardAvoidingView
				style={styles.container}
				behavior={Platform.OS === "ios" ? "padding" : undefined}>
				<View style={styles.form}>
					<View>
						<View style={{ justifyContent: "center" }}>
							{categories && categories.every((category) => category.id) && (
								<RNPickerSelect
									style={picker}
									useNativeAndroidPickerStyle={false}
									value={category}
									onValueChange={setCategory}
									placeholder={{
										label: "Category name",
										value: undefined,
									}}
									items={categories?.map((category) => ({
										key: category.id,
										label: category.nom,
										value: category.id,
									}))}
								/>
							)}
						</View>
						<TouchableOpacity
							onPress={() => navigation.navigate("NewCategory")}>
							<Text style={styles.linkColor}>New Catetory</Text>
						</TouchableOpacity>
						<StatusBar style="auto" />
					</View>

					<View style={styles.input}>
						<TextInput
							style={{ height: 50 }}
							placeholder="Expense name"
							onChangeText={setExpense}
							value={expense}
							maxLength={30}
						/>
					</View>

					<View style={styles.input}>
						<TextInput
							style={{ height: 50 }}
							placeholder="Amount"
							onChangeText={setAmount}
							value={amount}
							maxLength={5}
							keyboardType={"numeric"}
						/>
					</View>

					<TouchableOpacity onPress={() => setShow(true)}>
						<View style={styles.datePicker}>
							<Text style={{ color: grayPlaceholder }}>{formatDate(date)}</Text>
							<Ionicons
								name="calendar-outline"
								size={20}
								color={grayPlaceholder}
								style={styles.calendarIcon}
							/>
						</View>
					</TouchableOpacity>

					{show && (
						<DateTimePicker
							value={date}
							onChange={(e, date) => {
								if (date) setDate(date);
								setShow(false);
							}}
						/>
					)}

					<TouchableOpacity
						onPress={() => {
							createExpense().then(() => {
								Keyboard.dismiss();
								setCategory("");
								setExpense("");
								setAmount("");
								setDate(new Date());
							});
						}}>
						<View style={styles.button}>
							<Text style={styles.buttonText}>Add</Text>
						</View>
					</TouchableOpacity>
					<StatusBar style="auto" />
				</View>
			</KeyboardAvoidingView>
		</TouchableWithoutFeedback>
	);
};

export default NewExpense;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
	},

	linkColor: {
		color: "#5DB075",
		marginBottom: 8,
		marginRight: 10,
		alignSelf: "flex-end",
	},

	form: {
		alignSelf: "stretch",
		marginTop: 32,
		marginLeft: 16,
		marginRight: 16,
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

	datePicker: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "#F6F6F6",
		padding: 16,
		marginBottom: 16,
		borderWidth: 1,
		borderColor: "#E8E8E8",
		borderRadius: 8,
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
});

const picker = StyleSheet.create({
	placeholder: {
		color: grayPlaceholder,
	},

	inputAndroidContainer: {
		backgroundColor: "#F6F6F6",
		borderWidth: 1,
		borderColor: "#E8E8E8",
		padding: 16,
		borderRadius: 8,
		marginBottom: 8,
		height: 50,
	},

	inputAndroid: {
		color: "black",
	},

	inputIOSContainer: {
		backgroundColor: "#F6F6F6",
		borderWidth: 1,
		borderColor: "#E8E8E8",
		padding: 16,
		borderRadius: 8,
		marginBottom: 8,
		height: 50,
	},
});
