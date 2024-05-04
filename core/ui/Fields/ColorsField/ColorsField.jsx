import { useState } from "react";
import { colors } from "@modules/client/utils/colors";
import { Button } from "@nextui-org/react";
import classes from "./colorsField.module.css";

function ColorsField({ value, onChange, index, section }) {
  const [selectedColor, setSelectedColor] = useState(value);

  const changeStyle = (color) => {
    if (selectedColor) {
      if (selectedColor === color) {
        return {
          opacity: 1,
          transform: "scale(1.05)"
        };
      } else {
        return {
          opacity: 0.2,
        };
      }
    } else {
      return {
        opacity: 1,
      };
    }
  };

  const handleColorClick = (color) => {
    if (selectedColor === color) {
      onChange("color", "", index, section);
      setSelectedColor(null);
    } else {
      onChange("color", color, index, section);
      setSelectedColor(color);
    }
  };

  return (
    <div className={classes.colors_container}>
      {colors.map((color) => {
        return (
          <Button
            isIconOnly
            onPress={() => handleColorClick(color)}
            key={color}
            className={classes.color}
            style={{ backgroundColor: color, ...changeStyle(color) }}
          />
        );
      })}
    </div>
  );
}

export default ColorsField;
