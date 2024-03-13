import {
	Dimensions,
	StyleSheet,
	Text,
	TouchableHighlight,
	TouchableOpacity,
	View,
} from "react-native";
import { firebase } from "../../firebase";
import {
	collection,
	deleteDoc,
	doc,
	getDocs,
	orderBy,
	query,
	where,
} from "firebase/firestore";

import Ionicons from "react-native-vector-icons/Ionicons";
import GaugeExpenses from "../components/GaugeExpenses";
import { LineChart } from "react-native-chart-kit";
import { StatusBar } from "expo-status-bar";
import { SwipeListView } from "react-native-swipe-list-view";
// import Swiper from "react-native-swiper";
import { useCollectionData } from "react-firebase-hooks/firestore";

const auth = firebase.getAuth();

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

const Expenses = ({ navigation }) => {
	const user = auth.currentUser;

	const [categories, loadingCategories, errorCategories] = [];
	// useCollectionData(
	// 	query(
	// 		collection(db, "users", user.uid, "categories"),
	// 		orderBy("nom", "asc")
	// 	)
	// );

	const [expenses] = [];
	// useCollectionData(
	// 	query(collection(db, "users", user.uid, "expenses"))
	// );

	// Jauge circulaire

	const budgetMax = () => {
		const tmp = categories.reduce(
			(total, category) => total + category.limit,
			0
		);
		return tmp;
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
			.reduce((total, expense) => total + expense.amount, 0);
	};

	const dpt = expenses ? expensesTotal() : 0;
	const max = categories ? budgetMax() : 0;
	const percentage =
	expenses && categories && expenses.length > 0
			? Math.round((expensesTotal() / budgetMax()) * 100)
			: 0;

	const mois = [
		"JAN",
		"FEB",
		"MAR",
		"APR",
		"MAY",
		"JUN",
		"JUL",
		"AUG",
		"SEP",
		"OCT",
		"NOV",
		"DEC",
	];

	const calculateLastSixMonths = () => {
		const six = [];
		const d = new Date();

		for (let i = 1; i <= 6; i++) {
			const tmp = d.getMonth() - i;
			if (tmp < 0) {
				six.push(tmp + 12);
			} else {
				six.push(tmp);
			}
		}
		return six.reverse();
	};

	const lastSixMonths = calculateLastSixMonths();
	const lastSixMonthsLabels = lastSixMonths.map((noMonth) => mois[noMonth]);

	const sommeLastSixMonths = lastSixMonths.map((noMonth) => {
		if (expenses) {
			return expenses
				.filter((expense) => expense?.date.toDate().getMonth() === noMonth)
				.reduce((total, expense) => total + expense?.amount, 0);
		} else {
			return 0;
		}
	});

	const data = {
		labels: lastSixMonthsLabels,
		datasets: [
			{
				data: sommeLastSixMonths,
				color: (opacity = 1) => `rgba(75, 161, 68, ${opacity})`,
				strokeWidth: 2,
			},
		],
	};

	const chartConfig = {
		backgroundGradientFrom: "#fff",
		backgroundGradientFromOpacity: 0,
		backgroundGradientTo: "#fff",
		backgroundGradientToOpacity: 0.5,
		color: (opacity = 1) => `rgba(75, 161, 68, ${opacity})`,
		strokeWidth: 2,
		barPercentage: 0.5,
		useShadowColorFromDataset: false,
		propsForDots: {
			r: "3",
			strokeWidth: "3",
		},
	};

	const renderCategory = ({ item }) => {
		const sommeExpenseCategory = expenses
			? expenses
					.filter((expense) => expense.category === item.id)
					.reduce((total, expense) => total + expense.amount, 0)
			: 0;

		const taux = sommeExpenseCategory / item.limit;

		return (
			<TouchableHighlight
				style={styles.category}
				underlayColor="#f5f5f5"
				onPress={() => {
					navigation.navigate("ExpenseCategories", {
						categorie: item.id,
						title: item.name,
					});
				}}>
				<>
					<Text style={{ fontSize: 16, paddingLeft: 10 }}>{item.nom}</Text>
					<View
						style={{ flexDirection: "row", fontSize: 16, paddingRight: 10 }}>
						{taux < 0.7 && (
							<Text style={{ color: "green" }}>{sommeExpenseCategory} ₹</Text>
						)}

						{taux >= 0.7 && taux < 0.9 && (
							<Text style={{ color: "#e67e00" }}>
								{sommeExpenseCategory} ₹
							</Text>
						)}

						{taux >= 0.9 && taux < 1 && (
							<Text style={{ color: "red" }}>{sommeExpenseCategory} ₹</Text>
						)}

						{taux >= 1.0 && (
							<Text style={{ color: "#8c1818" }}>
								{sommeExpenseCategory} ₹
							</Text>
						)}

						<Text> / {item.limit} ₹</Text>
					</View>
				</>
			</TouchableHighlight>
		);
	};

	const renderSwipeButtons = (data, map) => (
		<View style={styles.swipeButtons}>
			<TouchableOpacity
				style={[styles.backButton, styles.backButtonRL]}
				onPress={() => map[data.item.id].closeRow()}>
				<Text style={{ color: "white" }}>Close</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={[styles.backButton, styles.backButtonRR]}
				onPress={async () => {
					await deleteCategorie(data.item.id);
				}}>
				<Ionicons name="trash-outline" color={"#FFF"} size={28} />
			</TouchableOpacity>

			<TouchableOpacity
				style={[styles.backButton, styles.backButtonL]}
				onPress={() => {
					navigation.navigate("EditCategory", {
						categorie: data.item.id,
						title: data.item.name,
					});
					map[data.item.id].closeRow();
				}}>
				<Ionicons name="create-outline" color={"#FFF"} size={28} />
			</TouchableOpacity>
		</View>
	);

	const deleteCategorie = async (id) => {
		// Suppression de la catégorie
		await deleteDoc(doc(db, "users", user.uid, "categories", id));

		// Suppression des dépenses de la catégorie
		const depenses = await getDocs(
			query(
				collection(db, "users", user.uid, "depenses"),
				where("categorie", "==", id.toString())
			)
		);
		depenses.forEach(async (depense) => {
			await deleteDoc(doc(db, "users", user.uid, "depenses", depense.id));
		});
	};

	return (
		<View style={styles.container}>
			<View
				style={[
					styles.semi,
					styles.container,
					{ backgroundColor: "#5BB774" },
				]}>
				<GaugeExpenses dpt={dpt} max={max} percentage={percentage} />
			</View>

			{/* Graphique */}
			<View style={styles.slide2}>
				<LineChart
					data={data}
					width={Dimensions.get("window").width}
					height={256}
					verticalLabelRotation={30}
					chartConfig={chartConfig}
					bezier
				/>
			</View>

			<View style={styles.semi}>
				{categories && categories.length === 0 && (
					<View style={{ marginTop: 20 }}>
						<Text style={{ alignSelf: "center" }}>
							You have no category. What if you added one with your first expense? 😉
						</Text>
					</View>
				)}

				{categories && categories.length > 0 && (
					<SwipeListView
						useFlatList={true}
						data={categories}
						renderItem={renderCategory}
						renderHiddenItem={renderSwipeButtons}
						keyExtractor={(item) => item.id}
						leftOpenValue={75}
						rightOpenValue={-150}
					/>
				)}

				{loadingCategories && (
					<View style={styles.container}>
						<Text>Loading your categories...</Text>
					</View>
				)}

				{errorCategories && (
					<View style={styles.container}>
						<Text>Error : {JSON.stringify(error)}</Text>
					</View>
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

	semi: { flex: 1, alignSelf: "stretch" },

	slide2: {
		flex: 1,
		justifyContent: "center",
		backgroundColor: "#fff",
	},

	// Swiper

	dot: {
		backgroundColor: "rgba(60,60,60,.3)",
		width: 10,
		height: 10,
		borderRadius: 7,
		marginLeft: 7,
		marginTop: 20,
	},

	activeDot: {
		backgroundColor: "#000",
		width: 10,
		height: 10,
		borderRadius: 7,
		marginLeft: 7,
		marginTop: 7,
		marginTop: 20,
	},

	// Catégories

	categorie: {
		flexDirection: "row",
		minWidth: "60%",
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

export default Expenses;
