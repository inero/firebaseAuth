import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../auth/HomeScreen';
import ProfileContent from './ProfileContent';
import ExpenseTracker from './ExpenseTracker';
import OverallView from './OverallView';

const Drawer = createDrawerNavigator();

const DashboardStack = () => {
    return (
        <Drawer.Navigator initialRouteName="Dashboard" drawerContent={props => <ProfileContent {...props} />}>
            <Drawer.Screen name="Dashboard" component={HomeScreen} />
            <Drawer.Screen name="Expense" component={ExpenseTracker} />
            <Drawer.Screen name="Overall" component={OverallView} />
        </Drawer.Navigator>
    );
};

export default DashboardStack;