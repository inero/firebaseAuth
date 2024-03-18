import CircularProgress, { ProgressRef } from "react-native-circular-progress-indicator";

const GaugeExpenses = ({ dpt, max, percentage }) => {

	return (
		<>
			{dpt <= max && (
				<CircularProgress
					value={dpt}
					valueSuffix={` ₹`}
					radius={125}
					duration={1000}
					textColor={"#ecf0f1"}
					maxValue={max}
					title={`${percentage}% spent this month`}
					titleColor={"white"}
					titleStyle={{ fontSize: 16, fontWeight: "400" }}
					textStyle={{ fontSize: 40, fontWeight: "500" }}
				/>
			)}

			{dpt > max && (
				<CircularProgress
					value={dpt}
					valueSuffix={` ₹`}
					radius={120}
					duration={1000}
					textColor={"#ecf0f1"}
					maxValue={dpt}
					title={`Total expenses`}
					titleColor={"white"}
					titleStyle={{ fontSize: 16, fontWeight: "400" }}
					textStyle={{ fontSize: 40, fontWeight: "500" }}
				/>
			)}
		</>
	);
};

export default GaugeExpenses;
