import { Input } from "@heroui/react";
import baseStyle from "../field.module.css";
import classes from "./inputField.module.css";

function InputField({
  label,
  ariaLabel,
  variant,
  placeholder,
  labelPlacement,
  classNames,
  onChange,
  value,
  endContent,
  isDisabled,
  min,
  max,
  type,
  isInvalid,
  errorMessage,
  labelStyle,
}) {
  return (
    <div className={baseStyle.input_container}>
      <p className={`${labelStyle} ${baseStyle.label}`}>{label}</p>
      <Input
        aria-label={label || ariaLabel}
        variant={variant}
        placeholder={placeholder}
        labelPlacement={labelPlacement}
        isDisabled={isDisabled}
        value={value}
        onValueChange={onChange}
        classNames={
          classNames
            ? classNames
            : {
                label: baseStyle.label,
                inputWrapper: baseStyle.main_wrapper,
                input: classes.value,
              }
        }
        min={min}
        max={max}
        type={type}
        endContent={endContent}
        isInvalid={isInvalid}
        errorMessage={errorMessage}
      />
    </div>
  );
}

export default InputField;
