import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SpeedometerGauge from './SpeedometerGauge';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const month = new Date().toLocaleString("en-US", { month: "long" });

  const dummyExpenses = [
    { id: '1', amount: 50, description: 'Groceries', date: '2024-03-10' },
    { id: '2', amount: 30, description: 'Dinner', date: '2024-03-09' },
    { id: '3', amount: 20, description: 'Coffee', date: '2024-03-08' },
    { id: '4', amount: 100, description: 'Shopping', date: '2024-03-07' },
  ];

  useEffect(() => {
    setExpenses(dummyExpenses);
  }, []);

  const getTotalExpenses = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{month}</Text>
      <SpeedometerGauge value={getTotalExpenses()} maxValue={500} />
      <View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0051a9'
  },
  statsText: {
    fontSize: 18,
    marginTop: 10,
  },
  dashboard: {
    marginBottom: 20,
  },
});

export default Dashboard;
