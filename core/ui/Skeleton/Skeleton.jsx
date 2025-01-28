import React from "react";
import classes from "./skeleton.module.css";

function Skeleton({ width, height }) {
  return (
    <div
      style={{ width: width, height: height }}
      className={classes.skeleton}
    />
  );
}

export default Skeleton;
