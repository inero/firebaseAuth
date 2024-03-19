import { FlatList, StyleSheet, Text, View, TouchableOpacity, ScrollView, RefreshControl } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebase } from "../../firebase";
import GaugeExpenses from "../components/GaugeExpenses";
import { StatusBar } from "expo-status-bar";
import Dialog from "react-native-dialog";
import { useState, useEffect, useCallback } from "react";
import { useSelector } from 'react-redux';
import Ionicons from "react-native-vector-icons/Ionicons";
import { updateProfile } from "firebase/auth";


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

	const expenses = useSelector((state) => state.expenses);
	const categories = useSelector((state) => state.categories);

	useEffect(() => {
		loadDashboardData();
	}, []);

	const loadDashboardData = () => {
		readBudget();
	}

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		loadDashboardData();
		setTimeout(() => {
			setRefreshing(false);
		}, 1000);
	}, []);


	const writeBudget = async (value) => {
		await AsyncStorage.setItem(
			'@budget',
			budget,
		);

		if (value !== null) {
			updateProfile(auth.currentUser, {
				photoURL: value
			}).then(() => {
				setBudget(value);
			}).catch((error) => {
				showMessage({
					message: "Something went wrong! try again later..",
					type: "danger",
				});
			});
		}
	};

	const readBudget = async () => {
		setBudget(auth?.currentUser?.photoURL);
	};

	const user = auth?.currentUser;

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
	const max = budget;
	const percentage = expenses && expenses.length > 0
		? Math.round((expensesTotal() / budget) * 100)
		: 0;

	const [latestExpenses, loading, error] = [[...expenses], loading, error];


	const renderExpense = ({ item }) => {
		const catName = categories.find((cat)=>{
			if(cat.id === item.category) return cat;
		})
		return (
			<View style={styles.item}>
				<Ionicons name={catName?.icon} style={styles.icon} size={35} />
				<View style={styles.details}>
					<Text style={styles.name}>{item.name}</Text>
					<Text style={styles.description}>{item.date}</Text>
				</View>
				<Text style={styles.amount}>{item.amount}</Text>
			</View>
		)
	};

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
				{!refreshing && (<GaugeExpenses dpt={exp} max={max} percentage={percentage} />)}
				{(exp > max) &&
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
						onPress={() => {
							writeBudget(budget);
							setModalVisible(!modalVisible)
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
							scrollEnabled={false} 
							renderItem={renderExpense}
							keyExtractor={(_item, index) => index}
							ListEmptyComponent={() => (
								<View style={styles.container}>
									<Text>
										You have no expense. Start adding your expenses!
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
		fontSize: 22,
		fontWeight: "500",
		alignSelf: "flex-start",
	},

	budgetContainer: {
		marginTop: 15,
		borderWidth: 1,
		borderColor: '#E8E8E8',
		padding: 5,
	},

	setBudget: {
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

	item: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 6,
		borderBottomWidth: 1,
		borderBottomColor: '#cccccc',
	},
	icon: {
		fontSize: 35,
		marginRight: 16,
		color: 'red',
	},
	details: {
		flex: 1,
	},
	name: {
		fontSize: 16,
		fontWeight: '500',
	},
	description: {
		fontSize: 14,
		color: '#999999',
	},
	amount: {
		fontSize: 18,
		fontWeight: 'bold',
		marginLeft: 16,
	},
});

export default Dashboard;
