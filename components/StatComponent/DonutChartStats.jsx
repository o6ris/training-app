import classes from "./donutChartStats.module.css";
import DonutChart from "@core/ui/Chart/DonutChart";

function DonutChartStats({ stats }) {
  return (
    <div className={classes.chart_wrapper}>
      <h3>Muscles repartition</h3>
      <DonutChart stats={stats} />
    </div>
  );
}

export default DonutChartStats;
