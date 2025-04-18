"use client";

import classes from "./filterButton.module.css";
import { Button, ButtonGroup } from "@heroui/react";
import Icon from "../Icons/Icon";

export default function App({ setFilter, filter }) {
  return (
    <ButtonGroup>
      <Button
        variant="bordered"
        isIconOnly
        onPress={() => setFilter("exercises")}
        className={`${filter === "exercises" && classes.active} ${
          classes.button
        }`}
        isDisabled={filter === "exercises"}
      >
        <Icon name="Dumbbell" strokeWidth={2} size={26} />
      </Button>
      <Button
        variant="bordered"
        isIconOnly
        onPress={() => setFilter("muscles")}
        className={`${filter === "muscles" && classes.active} ${
          classes.button
        }`}
        isDisabled={filter === "muscles"}
      >
        <Icon name="BicepsFlexed" strokeWidth={2} size={26} />
      </Button>
    </ButtonGroup>
  );
}
