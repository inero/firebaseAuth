import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { firebase } from "../../firebase";
import { collection, deleteDoc, doc, query, where } from "firebase/firestore";

import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { SwipeListView } from "react-native-swipe-list-view";
import { useCollectionData } from "react-firebase-hooks/firestore";

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

const ExpenseCategories = ({ navigation, route }) => {
	const user = auth?.currentUser;

	const [expenses] = [];
	// useCollectionData(
	// 	query(
	// 		collection(db, "users", user.uid, "expenses"),
	// 		where("category", "==", route.params.category)
	// 	)
	// );

	const renderExpense = ({ item }) => (
		<View style={styles.expense}>
			<Text style={{ flex: 1, fontSize: 16, paddingLeft: 10 }}>{item.name}</Text>
			<View
				style={{
					flex: 1,
					flexDirection: "row",
					justifyContent: "space-between",
				}}>
				<Text style={{ fontSize: 16 }}>{formatDate(item.date.toDate())}</Text>
				<Text style={{ fontSize: 16, paddingRight: 10 }}>{item.amount} ₹</Text>
			</View>
		</View>
	);

	const renderSwipeButtons = (data, map) => (
		<View style={styles.swipeButtons}>
			<TouchableOpacity
				style={[styles.backButton, styles.backButtonRL]}
				onPress={() => map[data.item.id].closeRow()}>
				<Text style={{ color: "white" }}>Fermer</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={[styles.backButton, styles.backButtonRR]}
				onPress={async () => {
					await deleteExpense(data.item.id);
				}}>
				<Ionicons name="trash-outline" color={"#FFF"} size={28} />
			</TouchableOpacity>

			<TouchableOpacity
				style={[styles.backButton, styles.backButtonL]}
				onPress={() => {
					map[data.item.id].closeRow();
					navigation.navigate("EditExpense", {
						expense: data.item.id,
						title: data.item.name,
					});
				}}>
				<Ionicons name="create-outline" color={"#FFF"} size={28} />
			</TouchableOpacity>
		</View>
	);

	const deleteExpense = async (id) => {
		await deleteDoc(doc(db, "users", user.uid, "expenses", id));
	};

	return (
		<View style={styles.container}>
			<View style={styles.expenses}>
				{expenses && expenses.length === 0 && (
					<View style={{ marginTop: 20 }}>
						<Text style={{ alignSelf: "center" }}>
							You have no expenses in this category. What if you add one?
						</Text>
					</View>
				)}

				{expenses && expenses.length > 0 && (
					<SwipeListView
						useFlatList={true}
						data={[...expenses].sort((a, b) => a.name > b.name)}
						renderItem={renderExpense}
						renderHiddenItem={renderSwipeButtons}
						keyExtractor={(item) => item.id}
						leftOpenValue={75}
						rightOpenValue={-150}
					/>
				)}
			</View>

			<StatusBar style="auto" />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},

	expenses: {
		flex: 1,
		alignSelf: "stretch",
	},

	expense: {
		flexDirection: "row",
		justifyContent: "space-between",
		borderBottomWidth: 1,
		borderBottomColor: "#E8E8E8",
		paddingTop: 16,
		paddingBottom: 16,
		backgroundColor: "white",
	},

	swipeButtons: {
		alignItems: "center",
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		paddingLeft: 15,
	},

	backButton: {
		alignItems: "center",
		bottom: 0,
		justifyContent: "center",
		position: "absolute",
		top: 0,
		width: 75,
	},

	backButtonL: {
		backgroundColor: "orange",
	},

	backButtonRL: {
		backgroundColor: "blue",
		right: 75,
	},

	backButtonRR: {
		backgroundColor: "red",
		right: 0,
	},
});

export default ExpenseCategories;
