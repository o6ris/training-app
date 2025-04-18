import classes from "./donutChart.module.css";
import { Doughnut } from "react-chartjs-2";
import useDonutChart from "@modules/client/charts/useDonutChart";
import ChartDataLabels from "chartjs-plugin-datalabels";

export default function DonutChart({ stats }) {
  const { doughnutData } = useDonutChart(stats);

  return (
    <div className={classes.chart_wrapper}>
      <Doughnut
        plugins={[
          ChartDataLabels,
          {
            id: "spacerBetweenChartAndLegend",
            afterInit(chart, args, options) {
              const originalFit = chart.legend.fit;
              chart.legend.fit = function fit() {
                originalFit.bind(chart.legend)();
                this.height += options.spacing || 20;
              };
            },
          },
        ]}
        options={{
          responsive: true,
          plugins: {
            datalabels: {
              color: "#fff", // percentage text color
              formatter: (value, context) => {
                const total = context.chart.data.datasets[0].data.reduce(
                  (sum, val) => sum + val,
                  0
                );
                const percentage = ((value / total) * 100).toFixed(1);
                return `${percentage}%`;
              },
              font: {
                weight: "bold",
                size: 14,
              },
            },
            legend: {
              display: true,
              position: "top",
              labels: {
                usePointStyle: true,
                pointStyle: "circle", 
                color: "#edf1ff",
              },
            },
            spacerBetweenChartAndLegend: {
              spacing: 10, // Adjust the spacing here
            },
          },
        }}
        data={doughnutData}
      />
    </div>
  );
}
