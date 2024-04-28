"use client";

import { useState } from "react";
import baseStyle from "../field.module.css";
import classes from "./selectField.module.css";
import { Select, SelectItem } from "@nextui-org/react";

export default function SelectField({
  items,
  label,
  variant,
  placeholder,
  labelPlacement,
  classNames,
}) {
  const [value, setValue] = useState(new Set([]));

  return (
    <div className={baseStyle.input_container}>
      <p className={baseStyle.label}>{label}</p>
      <Select
        items={items}
        aria-label={label}
        variant={variant}
        placeholder={placeholder}
        labelPlacement={labelPlacement}
        selectedKeys={value}
        classNames={
          classNames
            ? classNames
            : {
                label: baseStyle.label,
                value: baseStyle.value,
                trigger: baseStyle.main_wrapper,
                popoverContent: classes.listbox_container,
                listbox: classes.listbox,
              }
        }
        onSelectionChange={setValue}
        renderValue={(items) => {
          return items.map((item) => (
            <div key={item.key}>
              <span>{item.data.value}</span>
            </div>
          ));
        }}
      >
        {(item) => (
          <SelectItem key={item.id} textValue={item.name}>
            <div className={classes.select_item}>
              <p>{item.value}</p>
              <span>{item.desc}</span>
            </div>
          </SelectItem>
        )}
      </Select>
    </div>
  );
}
