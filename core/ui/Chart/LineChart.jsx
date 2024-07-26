import React, { useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import useLineChart from '@modules/client/charts/useLineChart';

function LineChart({ stats }) {
	const { chartData } = useLineChart(stats);

	return (
		<div>
			<Line
				options={{
					plugins: {
						legend: {
							display: false,
						},
						label: {
							display: false,
						},
					},
					scales: {
						x: {
							grid: {
								display: false,
							},
						},
						y: {
							beginAtZero: true,
						},
					},
				}}
				data={chartData}
			/>
		</div>
	);
}

export default LineChart;
