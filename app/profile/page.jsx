"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import classes from "./profile.module.css";
import InputField from "@core/ui/Fields/InputField/InputField";
import BasicButton from "@core/ui/Button/BasicButton";
import PopupButton from "@core/ui/Button/PopupButton";
import useUser from "@modules/client/requests/useUser";
import Icon from "@core/ui/Icons/Icon";

function page() {
  const [credentials, setCredentials] = useState();
  const [isEditable, setIsEditable] = useState(false);
  const [editCreds, setEditCreds] = useState(false);
  const editToggle = () => setIsEditable(!isEditable);
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisible = () => setIsVisible(!isVisible);
  const { data: userSession, status } = useSession();
  const { user, editUser } = useUser(userSession);

  const validateEmail = /^[a-z0-9._-]+@([a-z0-9-]+\.)+[a-z]{2,4}$/;
  const isEmailValid = validateEmail.test(credentials?.email);
  const isPasswordSame =
    credentials?.password === credentials?.confirmedPassword &&
    (credentials?.password !== "" ||
      credentials?.confirmedPassword !== "" ||
      credentials?.password !== undefined ||
      credentials?.confirmedPassword !== undefined);

  useEffect(() => {
    setCredentials(user);
  }, [user]);

  const handleOnChange = (name, value) => {
    const t = { ...credentials };
    t[name] = value;
    setCredentials(t);
  };

  console.log("credentials", credentials);

  return (
    <div className={classes.container}>
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
      <InputField
        label={<>Email {!isEmailValid && <span>(add valid format)</span>}</>}
        variant="bordered"
        placeholder="john.doe@mail.com"
        labelPlacement="outside"
        value={credentials?.email}
        onChange={(value) => handleOnChange("email", value)}
        isDisabled={!isEditable}
      />
      <div className={classes.buttons_wrapper}>
        <BasicButton
          onAction={editToggle}
          buttonContent={isEditable ? "Cancel" : "Edit"}
          buttonStyle={`${classes.button} ${classes.edit_button}`}
          startContent={
            !isEditable ? (
              <Icon name="Pencil" size={16} color="#EDF1FF" strokeWidth={3} />
            ) : (
              <Icon name="X" size={16} color="#EDF1FF" strokeWidth={3} />
            )
          }
        />
        <BasicButton
          onAction={() => editUser(user._id, credentials, setIsEditable)}
          buttonContent={"Validate"}
          buttonStyle={`${classes.validate_button} ${classes.button}`}
          isDisabled={!isEditable}
          startContent={
            <Icon name="Check" size={16} color="#EDF1FF" strokeWidth={3} />
          }
        />
      </div>
      {!editCreds && (
        <BasicButton
          onAction={() => setEditCreds(true)}
          buttonContent={"Change password ?"}
          buttonStyle={`${classes.display_creds}`}
        />
      )}
      {editCreds && (
        <>
          <InputField
            label="Password"
            variant="bordered"
            placeholder=""
            labelPlacement="outside"
            onChange={(value) => handleOnChange("password", value)}
            type={isVisible ? "text" : "password"}
            endContent={
              <BasicButton
                buttonStyle={classes.visible_button}
                buttonContent={
                  isVisible ? (
                    <Icon name="Eye" size={16} color="white" strokeWidth={3} />
                  ) : (
                    <Icon
                      name="EyeOff"
                      size={16}
                      color="white"
                      strokeWidth={3}
                    />
                  )
                }
                isIconOnly={true}
                onAction={toggleVisible}
              />
            }
          />
          <InputField
            label={
              <>
                New password{" "}
                {!isPasswordSame && <span>(add same password)</span>}
              </>
            }
            variant="bordered"
            placeholder=""
            labelPlacement="outside"
            onChange={(value) => handleOnChange("confirmedPassword", value)}
            type={isVisible ? "text" : "password"}
            endContent={
              <BasicButton
                buttonStyle={classes.visible_button}
                buttonContent={
                  isVisible ? (
                    <Icon name="Eye" size={16} color="white" strokeWidth={3} />
                  ) : (
                    <Icon
                      name="EyeOff"
                      size={16}
                      color="white"
                      strokeWidth={3}
                    />
                  )
                }
                isIconOnly={true}
                onAction={toggleVisible}
              />
            }
          />
          <div className={classes.buttons_wrapper}>
            <BasicButton
              onAction={() => setEditCreds(false)}
              buttonContent={"Cancel"}
              buttonStyle={`${classes.button} ${classes.edit_button}`}
              startContent={
                <Icon name="X" size={16} color="#EDF1FF" strokeWidth={3} />
              }
            />
            <BasicButton
              onAction={() => editUser(user._id, credentials, setEditCreds)}
              buttonContent={"Validate"}
              buttonStyle={`${classes.validate_button} ${classes.button}`}
              isDisabled={!isPasswordSame}
              startContent={
                <Icon name="Check" size={16} color="#EDF1FF" strokeWidth={3} />
              }
            />
          </div>
        </>
      )}
      <BasicButton
        onAction={() => signOut({ callbackUrl: "/login" })}
        buttonContent={"Logout"}
        buttonStyle={`${classes.logout_button} ${classes.button}`}
        startContent={
          <Icon name="LogOut" size={16} color="#BA0505" strokeWidth={3} />
        }
      />
    </div>
  );
}

export default page;
