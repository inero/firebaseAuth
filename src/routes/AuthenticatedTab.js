import Dashboard from "../pages/Dashboard";
import Chatbot from "../pages/Chatbot";
import ExpensesStack from "./ExpensesStack";
import Ionicons from "react-native-vector-icons/Ionicons";
import NewExpenseStack from "./NewExpenseStack";
import Profile from "../pages/Profile";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();

const AuthenticatedTab = () => {
	return (
		<Tab.Navigator
			screenOptions={{
				headerTitleAlign: "center",
				tabBarActiveTintColor: "#5DB075",
			}}>
			<Tab.Screen
				name="Dashboard"
				component={Dashboard}
				options={{
					headerShown: false,
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="home-outline" color={color} size={size} />
					),
				}}
			/>
			<Tab.Screen
				name="ExpensesStack"
				component={ExpensesStack}
				options={{
					headerShown: false,
					title: "Expense",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="wallet-outline" color={color} size={size} />
					),
				}}
			/>
			<Tab.Screen
				name="NewExpenseStack"
				component={NewExpenseStack}
				options={{
					headerShown: false,
					title: "New Expense",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="add-circle-outline" color={color} size={size} />
					),
				}}
			/>
			<Tab.Screen
				name="Chatbot"
				component={Chatbot}
				options={{
					headerShown: false,
					tabBarIcon: ({ color, size }) => (
						<Ionicons
							name="chatbubble-ellipses-outline"
							color={color}
							size={size}
						/>
					),
				}}
			/>
			<Tab.Screen
				name="Profile"
				component={Profile}
				options={{
					headerShown: false,
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="person-circle-outline" color={color} size={size} />
					),
				}}
			/>
		</Tab.Navigator>
	);
};

export default AuthenticatedTab;
