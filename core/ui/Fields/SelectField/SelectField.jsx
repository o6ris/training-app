"use client";

import baseStyle from "../field.module.css";
import classes from "./selectField.module.css";
import { Select, SelectItem, Chip } from "@nextui-org/react";

export default function SelectField({
  items,
  label,
  variant,
  placeholder,
  labelPlacement,
  isMultiline,
  selectionMode,
  classNames,
  selectOnChange,
  value,
}) {
  const handleRemoveItem = (item) => {
    const updatedValue = new Set(value);
    updatedValue.delete(item);
    selectOnChange(updatedValue);
  };

  return (
    <div className={baseStyle.input_container}>
      <p className={baseStyle.label}>{label}</p>
      <Select
        items={items}
        aria-label={label}
        variant={variant}
        placeholder={placeholder}
        labelPlacement={labelPlacement}
        selectionMode={selectionMode}
        isMultiline={isMultiline}
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
        onSelectionChange={selectOnChange}
        renderValue={(items) => {
          return (
            <div className={isMultiline ? classes.value_container : ""}>
              {items.map((item) =>
                isMultiline ? (
                  <Chip
                    key={item.key}
                    onClose={() => handleRemoveItem(item.key)}
                  >
                    {item.data.value}
                  </Chip>
                ) : (
                  <div key={item.key}>
                    <span>{item.data.value}</span>
                  </div>
                )
              )}
            </div>
          );
        }}
      >
        {(item) => (
          <SelectItem key={item.key} textValue={item.value}>
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
