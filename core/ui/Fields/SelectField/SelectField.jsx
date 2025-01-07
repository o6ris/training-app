"use client";

import baseStyle from "../field.module.css";
import classes from "./selectField.module.css";
import { Select, SelectItem, Chip } from "@nextui-org/react";
import Icon from "@core/ui/Icons/Icon";

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
  hasInfos,
}) {
  const handleRemoveItem = (item) => {
    const updatedValue = new Set(value);
    updatedValue.delete(item);
    selectOnChange(updatedValue);
  };
  const renderValue = () => {
    if (Array.isArray(value)) {
      return value;
    } else {
      return [value];
    }
  };

  // console.log("value", renderValue())

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
            <div className={classes.select_item_wrapper}>
              <div className={classes.select_item}>
                <p>{item.value}</p>
                <span>{item.desc}</span>
              </div>
              {hasInfos && (
                <button onClick={() => console.log("test")}>
                  <Icon
                    name="Info"
                    size={16}
                    color="#EDF1FF"
                    strokeWidth={2}
                  />
                </button>
              )}
            </div>
          </SelectItem>
        )}
      </Select>
    </div>
  );
}
