"use client";

import baseStyle from "../field.module.css";
import classes from "./selectField.module.css";
import { Select, SelectItem, Chip } from "@heroui/react";
import { Avatar } from "@heroui/react";
import Icon from "@core/ui/Icons/Icon";
import ClipLoader from "react-spinners/ClipLoader";
import Skeleton from "@core/ui/Skeleton/Skeleton";

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
  hasImage,
  isLoading,
}) {
  const handleRemoveItem = (item) => {
    const updatedValue = new Set(value);
    updatedValue.delete(item);
    selectOnChange(updatedValue);
  };
  const renderValue = () => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  };

  const cloudinaryUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`;
  const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}`

  return (
    <div className={baseStyle.input_container}>
      <div className={baseStyle.label}>{label}</div>
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
        selectorIcon={
          isLoading ? (
            <ClipLoader
              color={"#EDF1FF"}
              loading={isLoading}
              size={20}
              aria-label="Loading Spinner"
            />
          ) : (
            <Icon name="ChevronDown" size={16} color="#EDF1FF" />
          )
        }
        disallowEmptySelection={disallowEmptySelection}
        classNames={{
          label: baseStyle.label,
          value: baseStyle.value,
          trigger: baseStyle.main_wrapper,
          popoverContent: classes.listbox_container,
          listbox: classes.listbox,
          ...(classNames || {}),
        }}
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
              {hasImage && (
                <Avatar
                  showFallback
                  name={item.value}
                  src={`${imageUrl}${
                    items.find((el) => el.key === item.key)?.image
                  }`}
                />
              )}
              {isLoading ? (
                <Skeleton width="90%" height="20px" />
              ) : (
                <p>{item.value}</p>
              )}
            </div>
          </SelectItem>
        )}
      </Select>
    </div>
  );
}
