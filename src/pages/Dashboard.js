import { FlatList, StyleSheet, Text, View, TouchableOpacity, ScrollView, RefreshControl } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import Dialog from "react-native-dialog";
import { useState, useEffect, useCallback } from "react";

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
	const [refreshing, setRefreshing] = useState(false);

	const [modalVisible, setModalVisible] = useState(false);
	const [budget, setBudget] = useState(0);

	useEffect(() => {
		readData();
	}, []);

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		readData();
		setTimeout(() => {
		  setRefreshing(false);
		}, 1000);
	}, []);

	const readData = async () => {
		const value = await AsyncStorage.getItem('@budget');
	
		if (value !== null) {
			setBudget(value);
		}
	};

	const user = auth?.currentUser;

	// Circular progress bar

	// const [categories] = []; 
	// useCollectionData(
	// 	query(collection(db, "users", user.uid, "categories"))
	// );

	// const [expenses, loadingExpenses, errorExpenses] = [{ 
		
	// }];
	// useCollectionData(
	// 	query(collection(db, "users", user.uid, "expenses"))
	// );

	const expenses = [{
		id: 1,
		name: 'Medical',
		date: '10/10/2024',
		amount: '5000',
		category: 1
	}, {
		id: 2,
		name: 'Food',
		date: '10/10/2024',
		amount: '2400',
		category: 2
	}];

	const categories = [{
		id: 1,
		name: 'Health',
		limit: '2000'
	},{
		id: 2,
		name: 'Shopping',
		limit: '100'
	}]; 

	// const budgetMax = () => {
	// 	return categories.reduce((total, category) => parseInt(total) + parseInt(category.limit), 0);
	// };

	const expensesTotal = () => {
		const p = previousMonth();
		const n = nextMonth();

		return expenses.filter((expense) => {
				const d = expense.date ? new Date() : new Date();
				d.setMilliseconds(0);

				return d > p && d < n;
			})
			.reduce((total, expense) => parseInt(total) + parseInt(expense.amount), 0);
	};

	const exp = expenses ? expensesTotal() : 0;
	const max = budget; //categories ? budgetMax() : 0;
	const percentage = expenses && categories && expenses.length > 0
			? Math.round((expensesTotal() / budget) * 100)
			: 0;

	const [latestExpenses, loading, error] = [[...expenses], loading, error];

	// useCollectionData(
	// 	query(
	// 		collection(db, "users", user.uid, "expenses"),
	// 		orderBy("date", "desc"),
	// 		limit(5)
	// 	)
	// );

	const renderExpense = ({ item }) => (
		<View style={styles.expense}>
			<Text style={{ fontSize: 16 }}>{item.name}</Text>
			<Text style={{ fontSize: 16 }}>{item.amount} ₹</Text>
		</View>
	);

	return (
		<ScrollView contentContainerStyle={styles.container} refreshControl={
			<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
		  }>
			<View
				style={[
					styles.semi,
					{
						alignItems: "center",
						justifyContent: "center",
						backgroundColor: "#2a3e48",
					},
				]}>
				<GaugeExpenses dpt={exp} max={max} percentage={percentage} />
				{exp > max &&
					(<TouchableOpacity onPress={() => setModalVisible(true)}>
						<View style={styles.budgetContainer}>
							<Text style={styles.setBudget}>Set budget</Text>
						</View>
					</TouchableOpacity>)
				}
				<Dialog.Container
					visible={modalVisible}
					onBackdropPress={() => {
						setModalVisible(false);
					}}>
					<Dialog.Title>Set Budget</Dialog.Title>
					<Dialog.Input
						value={budget}
						placeholder="Budget"
						onChangeText={setBudget}
						maxLength={20}
						keyboardType={"numeric"}
					/>
					<Dialog.Button
						label="Close"
						onPress={() => setModalVisible(false)}
					/>
					<Dialog.Button
						label="Confirm"
						onPress={async () => {
							await AsyncStorage.setItem(
								'@budget',
								budget,
								);
							setModalVisible(!modalVisible);
						}}
					/>
				</Dialog.Container>
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
		</ScrollView>
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

	budgetContainer: {
		marginTop: 15,
		borderWidth: 1,
		borderColor: '#E8E8E8',
		padding: 5,
	},

	setBudget:{
		fontSize: 15,
		color: '#E8E8E8',
		fontWeight: "400",
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
