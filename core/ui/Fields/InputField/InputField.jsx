import { Input } from "@nextui-org/react";
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
}) {
  return (
    <div className={baseStyle.input_container}>
      <p className={baseStyle.label}>{label}</p>
      <Input
        aria-label={label}
        variant={variant}
        placeholder={placeholder}
        labelPlacement={labelPlacement}
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
      />
    </div>
  );
}

export default InputField;
