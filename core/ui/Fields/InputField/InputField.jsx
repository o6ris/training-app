import { Input } from "@heroui/react";
import baseStyle from "../field.module.css";
import classes from "./inputField.module.css"

function InputField({
  label,
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
}) {
  return (
    <div className={baseStyle.input_container}>
      <p className={baseStyle.label}>{label}</p>
      <Input
        aria-label={label}
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
