import React, { useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import useBarChart from '@modules/client/charts/useBarChart';

function BarChart({ stats }) {
	const { chartData } = useBarChart(stats);

	return (
		<div>
			<Bar
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
							beginAtZero: true,
							grid: {
								display: false,
							},
							stacked: true,
						},
						y: {
							stacked: true,
						},
					},
				}}
				data={chartData}
			/>
		</div>
	);
}

export default BarChart;
