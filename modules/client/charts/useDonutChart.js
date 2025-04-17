import { useMemo } from 'react';
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";

export default function useDonutChart(stats) {
  Chart.register(CategoryScale);

	const doughnutData = useMemo(() => {
		const labels = [];
		const values = [];

		if (stats && typeof stats === 'object') {
			for (const [k, v] of Object.entries(stats)) {
					labels.push(k);
					values.push(parseFloat(v.percentage));
				}
		}

    // console.log("labels", labels)
    // console.log("values", values)

		return {
			labels: labels,
			datasets: [
				{
					label: 'Total Volume',
					data: values,
					backgroundColor: [
						'#1A2260',
						'#3058b1',
						'#5a7fd1',
						'#6F7BD8',
						'#9da2cc',
						'#ADADAD',
					],
					borderWidth: 0,
					spacing: 2,
				},
			],
		};
	}, [stats]);

	return {
		doughnutData,
	};

}