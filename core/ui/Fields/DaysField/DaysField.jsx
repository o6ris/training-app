import { useState } from "react";
import baseStyle from "../field.module.css";
import classes from "./daysField.module.css";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";

function DaysField({ label, items }) {
  const days = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"];
  return (
    <div>
      <p className={baseStyle.label}>{label}</p>
      <div className={baseStyle.multiple_buttons_container}>
        {days.map((day, index) => {
          return (
            <Dropdown
              classNames={{
                content: classes.list_container,
              }}
            >
              <DropdownTrigger>
                <Button className={baseStyle.multiple_buttons}>{day}</Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Single selection example"
                variant="flat"
                selectionMode="single"
              >
                {items.map((item) => {
                  return (
                    <DropdownItem key={item.key}>{item.value}</DropdownItem>
                  );
                })}
              </DropdownMenu>
            </Dropdown>
          );
        })}
      </div>
    </div>
  );
}

export default DaysField;
