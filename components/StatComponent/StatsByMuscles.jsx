import classes from "./statsByMuscles.module.css";

function StatsByMuscles({ stat }) {
  return (
    <div className={classes.data_wrapper}>
      <div className={`${classes.data}`}>
        <p className={classes.data_value}>{stat?.totalVolume.toFixed(0)}</p>
        <p className={classes.data_title}>Volume (kg)</p>
      </div>
      <div className={`${classes.data}`}>
        <p className={classes.data_value}> {stat?.percentage}</p>
        <p className={classes.data_title}>Ratio</p>
      </div>
    </div>
  );
}

export default StatsByMuscles;
