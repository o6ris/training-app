import React from "react";
import classes from "./skeleton.module.css";

function Skeleton({ width, height, className }) {
  return (
    <div
      style={{ width: width, height: height }}
      className={`${classes.skeleton} ${className}`}
    />
  );
}

export default Skeleton;
