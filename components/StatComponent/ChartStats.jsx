import classes from "./chartStats.module.css";
import LineChart from "@core/ui/Chart/LineChart";
import formatDate from "@modules/client/utils/formatDate";

function ChartStats({ stats, getStatById, range, startDate, customStartDate }) {
  return (
    <div className={classes.chart_wrapper}>
      <div>
        <h3>Volume (T)</h3>
        <p className={classes.chart_subtitle}>
          {formatDate(startDate, false)} - {formatDate(new Date(), false)}
        </p>
      </div>
      <LineChart stats={stats} getStatById={getStatById} range={range} customStartDate={customStartDate} />
    </div>
  );
}

export default ChartStats;
