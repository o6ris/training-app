import { useMemo } from "react";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import formatDate from "@modules/client/utils/formatDate";

export default function useLineChart(stats) {
  Chart.register(CategoryScale);

  console.log("useStats", stats);

  const chartData = useMemo(() => {
    
    const labels = stats
      ?.map((stat) => formatDate(stat?.date, false).slice(0, 5))
      .reverse();

    const data = stats
      ?.map((stat) =>
        stat?.sets.reduce(
          (sum, current) => sum + current.reps * (current.weight / 1000),
          0
        )
      )
      .reverse();

    const segmentColor = (ctx) => {
      const { p0, p1 } = ctx;
      if (p1.parsed.y > p0.parsed.y) {
        return "#05BA8F";
      } else if (p1.parsed.y < p0.parsed.y) {
        return "#BA0505";
      } else {
        return "#2694F9";
      }
    };

    return {
      labels: labels,
      datasets: [
        {
          label: "Volume",
          data: data,
          segment: {
            borderColor: segmentColor,
          },
          pointStyle: "circle",
          pointRadius: 5,
          pointHoverRadius: 10,
        },
      ],
    };
  }, [stats]);

  return {
    chartData,
  };
}
