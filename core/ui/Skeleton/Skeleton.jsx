import React from "react";
import classes from "./skeleton.module.css";

function Skeleton({ width, height, className, style, classDefault = true }) {
  return (
    <div
      style={{ width: width, height: height, ...style }}
      className={`${classDefault && classes.skeleton} ${className}`}
    />
  );
}

export default Skeleton;
