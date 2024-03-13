import { FlatList, StyleSheet, Text, View } from "react-native";
import {
	Timestamp,
	collection,
	limit,
	orderBy,
	query,
} from "firebase/firestore";
import { firebase } from "../../firebase";

import GaugeExpenses from "../components/GaugeExpenses";
import { StatusBar } from "expo-status-bar";
import { useCollectionData } from "react-firebase-hooks/firestore";

// function that returns date of last day of previous month
const previousMonth = () => {
	const date = new Date();
	date.setDate(0);
	date.setHours(23);
	date.setMinutes(59);
	date.setSeconds(59);
	date.setMilliseconds(999);
	return date;
};

// function that returns date of first day of next month
const nextMonth = () => {
	const date = new Date();
	date.setDate(1);
	date.setMonth(date.getMonth() + 1);
	date.setHours(0);
	date.setMinutes(0);
	date.setSeconds(0);
	date.setMilliseconds(0);
	return date;
};

const auth = firebase.getAuth();

const Dashboard = () => {
	const user = auth?.currentUser;

	// Circular progress bar

	const [categories] = []; 
	// useCollectionData(
	// 	query(collection(db, "users", user.uid, "categories"))
	// );

	const [expenses, loadingExpenses, errorExpenses] = [];
	// useCollectionData(
	// 	query(collection(db, "users", user.uid, "expenses"))
	// );

	const budgetMax = () => {
		return categories.reduce((total, category) => total + category.limit, 0);
	};

	const expensesTotal = () => {
		const p = previousMonth();
		const n = nextMonth();

		return expenses
			.filter((expense) => {
				const d = expense.date.toDate();
				d.setMilliseconds(0);

				return d > p && d < n;
			})
			.reduce((total, expense) => total + expense.montant, 0);
	};

	const dpt = expenses ? expensesTotal() : 0;
	const max = categories ? budgetMax() : 0;
	const percentage = expenses && categories && expenses.length > 0
			? Math.round((expensesTotal() / budgetMax()) * 100)
			: 0;

	const [latestExpenses, loading, error] = [];
	// useCollectionData(
	// 	query(
	// 		collection(db, "users", user.uid, "expenses"),
	// 		orderBy("date", "desc"),
	// 		limit(5)
	// 	)
	// );

	const renderExpense = ({ item }) => (
		<View style={styles.expense}>
			<Text style={{ fontSize: 16 }}>{item.nom}</Text>
			<Text style={{ fontSize: 16 }}>{item.montant} ₹</Text>
		</View>
	);

	return (
		<View style={styles.container}>
			<View
				style={[
					styles.semi,
					{
						alignItems: "center",
						justifyContent: "center",
						backgroundColor: "#2a3e48",
					},
				]}>
				<GaugeExpenses dpt={dpt} max={max} percentage={percentage} />
			</View>

			<View style={styles.semi}>
				<View style={styles.latestExpenses}>
					<Text style={styles.title}>Recent expenses</Text>

					{latestExpenses && (
						<FlatList
							style={styles.listExpenses}
							data={latestExpenses}
							renderItem={renderExpense}
							keyExtractor={(_item, index) => index}
							ListEmptyComponent={() => (
								<View style={styles.container}>
									<Text>
										You have no expenses. What if you added one?
									</Text>
								</View>
							)}
						/>
					)}

					{loading && (
						<View style={styles.container}>
							<Text>Loading your latest expenses...</Text>
						</View>
					)}

					{error && (
						<View style={styles.container}>
							<Text>Error : {JSON.stringify(error)}</Text>
						</View>
					)}
				</View>
			</View>
			<StatusBar style="auto" />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#dceaf0",
		alignItems: "center",
		justifyContent: "center",
	},

	semi: { flex: 1, alignSelf: "stretch" },

	title: {
		fontSize: 24,
		fontWeight: "500",
		alignSelf: "flex-start",
	},

	latestExpenses: {
		flex: 1,
		paddingTop: 25,
		paddingLeft: 20, // 16 avec icône couleur
		paddingRight: 20, // 16
	},

	listExpenses: {
		marginTop: 32,
	},

	expense: {
		flexDirection: "row",
		justifyContent: "space-between",
		borderBottomWidth: 1,
		borderBottomColor: "#E8E8E8",
		paddingTop: 16,
		paddingBottom: 16,
	},
});

export default Dashboard;
