import { useMemo } from "react";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";

export default function useDonutChart(stats) {
  Chart.register(CategoryScale);

  const doughnutData = useMemo(() => {
    const labels = [];
    const values = [];

    if (stats && typeof stats === "object") {
      for (const [k, v] of Object.entries(stats)) {
        labels.push(k);
        values.push(parseFloat(v.percentage));
      }
    }

    return {
      labels: labels,
      datasets: [
        {
          label: "Volume",
          data: values,
          backgroundColor: [
            "#c44343",
            "#4ecd96",
            "#ff9b3d",
            "#1A91F0",
            "#A78BFA",
            "#F472B6",
          ],
          borderWidth: 4,
          borderColor: "#1c2647",
          spacing: 2,
          cutout: "45%",
          hoverOffset: 10,
        },
      ],
    };
  }, [stats]);

  return {
    doughnutData,
  };
}
