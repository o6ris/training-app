import React, { useRef } from "react";
import classes from "./lineChart.module.css"
import { Line } from "react-chartjs-2";
import useLineChart from "@modules/client/charts/useLineChart";

function LineChart({ stats, getStatById, range, customEndDate }) {
  const { chartData } = useLineChart(stats, range, customEndDate);
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
    <div className={classes.chart_wrapper}>
      <Line
        ref={chartRef}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            label: {
              display: false,
            },
            zoom: {
              pan: {
                enabled: true,
                mode: "x",
              },
              zoom: {
                wheel: {
                  enabled: true,
                },
                pinch: {
                  enabled: true,
                },
                mode: "x",
              },
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
              ticks: {
                autoSkip: true,
                maxTicksLimit: 6,
              },
              suggestedMin: 0,
              suggestedMax:
                Math.max(...chartData.datasets[0].data.map((d) => d.y)) * 1.3,
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
