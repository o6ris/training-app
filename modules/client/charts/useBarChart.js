import { useMemo } from "react";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import formatDate from "@modules/client/utils/formatDate";

export default function useBarCharts(stats) {
  Chart.register(CategoryScale);

  console.log("useStats", stats);

  const chartData = useMemo(() => {
    return {
      labels: stats?.map((stat) => formatDate(stat?.date, false)).reverse(),
      datasets: [
        {
          label: "Taux d'occupation",
          data: stats?.map((stat) =>
            stat?.sets.reduce(
              (sum, current) => sum + current.reps * current.weight,
              0
            )
          ).reverse(),
          backgroundColor: ["#2694F9"],
          barThickness: 20,
          borderRadius: 10,
        },
      ],
    };
  }, [stats]);

  return {
    chartData,
  };
}
