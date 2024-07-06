import React from "react";
import baseStyle from "../field.module.css";
import classes from "./slider.module.css";
import { Slider, Button } from "@nextui-org/react";

function SliderField({ label, color, value, onChange, classNames }) {
  return (
    <div>
      <div className={baseStyle.label_wrapper}>
        <p className={baseStyle.label}>{label}</p>
        <p className={classes.label_value}>{value}</p>
      </div>
      <Slider
        classNames={
          classNames
            ? classNames
            : {
                track: classes.slider,
                filler: classes.slider_filler,
                thumb: classes.thumb,
              }
        }
        aria-label={label}
        showTooltip={true}
        size="lg"
        color={color}
        step={1}
        maxValue={7}
        minValue={0}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default SliderField;
