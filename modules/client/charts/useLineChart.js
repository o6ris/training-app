import { useMemo } from "react";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import formatDate from "@modules/client/utils/formatDate";

const generateDateRange = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);
  let extendedEndDate = new Date(endDate);
  extendedEndDate.setDate(extendedEndDate.getDate() + 5); // Add 5 extra days
  while (currentDate <= extendedEndDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};

const filterStatsByRange = (stats, range, customEndDate) => {
  const now = new Date();
  let startDate;

  switch (range) {
    case "month":
      startDate = new Date(now.setDate(now.getDate() - 30));
      break;
    case "trim":
      startDate = new Date(now.setMonth(now.getMonth() - 3));
      break;
    case "sem":
      startDate = new Date(now.setMonth(now.getMonth() - 6));
      break;
    case "year":
      startDate = new Date(now.setMonth(now.getMonth() - 12));
      startDate.setDate(startDate.getDate() + 1); // Subtract one day
      break;
    default:
      startDate = new Date(0);
  }

  const endDate = customEndDate ? new Date(customEndDate) : new Date();

  return {
    filteredStats: stats.filter((stat) => new Date(stat.date) >= startDate),
    startDate,
    endDate,
  };
};

export default function useLineChart(stats, range, customEndDate = null) {
  Chart.register(CategoryScale, zoomPlugin);

  const chartData = useMemo(() => {
    const { filteredStats, startDate, endDate } = filterStatsByRange(
      stats,
      range,
      customEndDate
    );
    const dateRange = generateDateRange(startDate, endDate);

    const labels = dateRange.map((date) => {
      const fullDate = formatDate(date, false); // Full date for alignment
      return fullDate.slice(0, 5); // Shortened format for display (DD/MM)
    });

    const data = dateRange
      .map((date) => {
        const stat = filteredStats.find(
          (stat) =>
            formatDate(new Date(stat.date), false) === formatDate(date, false)
        );
        return stat
          ? {
              x: formatDate(date, false).slice(0, 5),
              y: stat.sets.reduce(
                (sum, current) => sum + current.reps * (current.weight / 1000),
                0
              ),
              _id: stat._id,
              exerciseName: stat.exercise.name,
            }
          : null;
      })
      .filter((point) => point !== null); // Filter out null values

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
          label: "Volume (T)",
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
  }, [stats, range]);

  return {
    chartData,
  };
}
