import React from "react";
import classes from "./volumeDetails.module.css";

function VolumeDetails({ stat }) {
  return (
    <div className={classes.tableContainer}>
      <div className={classes.table}>
        <div className={`${classes.row} ${classes.header}`}>
          <div className={classes.cell}>Reps</div>
          <div className={classes.cell}>Weight</div>
        </div>
        {stat?.sets.map((set, i) => (
          <div className={classes.row} key={i}>
            <div className={classes.cell}>{set.reps}</div>
            <div className={classes.cell}>{set.weight} Kg</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VolumeDetails;
