"use client";

import baseStyle from "../field.module.css";
import classes from "./selectField.module.css";
import { Select, SelectItem, Chip } from "@heroui/react";
import { Avatar } from "@heroui/react";

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
  isDisabled,
  disallowEmptySelection,
  ariaLabel,
  hasImage
}) {
  const handleRemoveItem = (item) => {
    const updatedValue = new Set(value);
    updatedValue.delete(item);
    selectOnChange(updatedValue);
  };
  const renderValue = () => {
    if (Array.isArray(value))
    {
      return value;
    } else
    {
      return [value];
    }
  };

  console.log("items", items)

  return (
    <div className={baseStyle.input_container}>
      <p className={baseStyle.label}>{label}</p>
      <Select
        items={items}
        aria-label={label || ariaLabel}
        variant={variant}
        placeholder={placeholder}
        labelPlacement={labelPlacement}
        selectionMode={selectionMode}
        isMultiline={isMultiline}
        selectedKeys={renderValue()}
        isDisabled={isDisabled}
        disallowEmptySelection={disallowEmptySelection}
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
              {hasImage &&
                <Avatar showFallback name={items.find((el) =>
                  el.key === item.key
                )?.image} src={items.find((el) =>
                  el.key === item.key
                )?.image} />}
              <p>{item.value}</p>
            </div>
          </SelectItem>
        )}
      </Select>
    </div>
  );
}
