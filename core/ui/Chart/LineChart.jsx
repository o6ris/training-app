import React, { useRef, useEffect } from "react";
import { Line } from "react-chartjs-2";
import useLineChart from "@modules/client/charts/useLineChart";

function LineChart({ stats, getStatById }) {
  const { chartData } = useLineChart(stats);
  const chartRef = useRef(null);

  const handleClick = (event) => {
    const chart = chartRef.current;
    if (!chart) return;
    const elements = chart.getElementsAtEventForMode(
      event,
      "nearest",
      { intersect: true },
      false
    );
    if (elements.length) {
      const { index } = elements[0];
			const selectedStat = chart.data.datasets[0].data[index];
      getStatById(selectedStat._id, selectedStat.exerciseName);
    }
  };

  return (
    <div>
      <Line
        ref={chartRef}
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
          onClick: handleClick,
        }}
        data={chartData}
      />
    </div>
  );
}

export default LineChart;
