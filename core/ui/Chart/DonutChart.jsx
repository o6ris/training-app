import classes from "./donutChart.module.css";
import { Doughnut } from "react-chartjs-2";
import useDonutChart from "@modules/client/charts/useDonutChart";

export default function DonutChart({ stats }) {
  const { doughnutData } = useDonutChart(stats);

  return (
    <div className={classes.chart_wrapper}>
      <Doughnut
        plugins={[
          {
            id: "spacerBetweenChartAndLegend",
            afterInit(chart, args, options) {
              const originalFit = chart.legend.fit;
              console.log("originalFit",originalFit)
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
            legend: {
              position: "top",
            },
            spacerBetweenChartAndLegend: {
              spacing: 30, // Adjust the spacing here
            },
          },
        }}
        data={doughnutData}
      />
    </div>
  );
}
