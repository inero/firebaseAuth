import CircularProgress from "react-native-circular-progress-indicator";

const GaugeExpenses = ({ exp, max, percentage }) => {

	return (
		<>
			{exp <= max && (
				<CircularProgress
					value={exp}
					valueSuffix={` ₹`}
					radius={125}
					duration={2000}
					textColor={"#ecf0f1"}
					maxValue={max}
					title={`${percentage}% spent this month`}
					titleColor={"white"}
					titleStyle={{ fontSize: 16, fontWeight: "400" }}
					textStyle={{ fontSize: 35, fontWeight: "500" }}
				/>
			)}

			{exp > max && (
				<CircularProgress
					value={exp}
					valueSuffix={` ₹`}
					radius={120}
					duration={2000}
					textColor={"#ecf0f1"}
					maxValue={exp}
					title={`Total expenses`}
					titleColor={"white"}
					titleStyle={{ fontSize: 16, fontWeight: "400" }}
					textStyle={{ fontSize: 35, fontWeight: "500" }}
				/>
			)}
		</>
	);
};

export default GaugeExpenses;
