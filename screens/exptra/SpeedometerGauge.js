import React from 'react';
import { View, Text, StyleSheet, PanResponder } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

const SpeedometerGauge = ({ value, maxValue }) => {
  const gaugeWidth = 200;
  const gaugeHeight = 200;
  const gaugeRadius = 90;
  const strokeWidth = 20;

  // Calculate angle based on value and maxValue
  const angle = (value / maxValue) * 180;

  return (
    <View style={styles.container}>
      <Svg height={gaugeHeight} width={gaugeWidth}>
        <Circle
          cx={gaugeWidth / 2}
          cy={gaugeHeight / 2}
          r={gaugeRadius}
          fill="none"
          stroke="#E0E0E0"
          strokeWidth={strokeWidth}
        />
        <Path
          d={`M${gaugeWidth / 2},${strokeWidth / 2}
              A${gaugeRadius},${gaugeRadius} 0 ${angle > 180 ? '1' : '0'},1
              ${gaugeWidth / 2 + gaugeRadius * Math.sin(angle * (Math.PI / 180))},${gaugeHeight / 2 + gaugeRadius * Math.cos(angle * (Math.PI / 180))}
            `}
          fill="none"
          stroke="#007bff"
          strokeWidth={strokeWidth}
        />
      </Svg>
      
      <Text style={styles.amount}>₹{value}</Text>
      <Text style={styles.text}>{'Overall Spend'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  amount: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: -110,
    color: '#007bff',
  },
  text: {
    fontSize: 16,
    marginTop: -50,
    color: 'grey'
  },
});

export default SpeedometerGauge;