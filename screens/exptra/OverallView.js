import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const data = {
  labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY'],
  datasets: [
    {
      data: [200000, 450000, 280000, 800000, 920000],
    },
  ],
};

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
  style: {
    borderRadius: 16,
  },
};

const OerallView = () => {
  return (
    <View style={styles.container}>
      <BarChart
        data={data}
        width={340}
        height={200}
        yAxisLabel={'₹'}
        chartConfig={chartConfig}
        verticalLabelRotation={0}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'white',
  },
});

export default OerallView;
