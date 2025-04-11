"use client";

import classes from "./profileForm.module.css";
import InputField from "@core/ui/Fields/InputField/InputField";

function ProfileForm({
  credentials,
  handleOnChange,
  isEditable,
  isEmailValid,
}) {
  return (
    <div className={classes.form_wrapper}>
      <InputField
        label={"Name"}
        variant="bordered"
        placeholder="john"
        labelPlacement="outside"
        value={credentials?.name}
        onChange={(value) => handleOnChange("name", value)}
        isDisabled={!isEditable}
      />
      <InputField
        variant="bordered"
        label="Age"
        placeholder="35"
        labelPlacement="outside"
        value={credentials?.age}
        type="number"
        endContent={"years"}
        onChange={(value) => handleOnChange("age", value)}
        isDisabled={!isEditable}
      />
      <InputField
        variant="bordered"
        label="Height"
        placeholder="170"
        labelPlacement="outside"
        value={credentials?.height}
        type="number"
        endContent={"cm"}
        onChange={(value) => handleOnChange("height", value)}
        isDisabled={!isEditable}
      />
      <InputField
        variant="bordered"
        label="Weight"
        placeholder="70"
        labelPlacement="outside"
        value={credentials?.weight}
        type="number"
        endContent={"kg"}
        onChange={(value) => handleOnChange("weight", value)}
        isDisabled={!isEditable}
      />
      {isEmailValid && (
        <InputField
          label={<>Email {!isEmailValid && <span>(add valid format)</span>}</>}
          variant="bordered"
          placeholder="john.doe@mail.com"
          labelPlacement="outside"
          value={credentials?.email}
          isDisabled={true}
        />
      )}
    </div>
  );
}

export default ProfileForm;
