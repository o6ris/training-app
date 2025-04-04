"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import classes from "./profile.module.css";
import ProfileForm from "@components/ProfileForm/ProfileForm";
import InputField from "@core/ui/Fields/InputField/InputField";
import BasicButton from "@core/ui/Button/BasicButton";
import useUser from "@modules/client/requests/useUser";
import Icon from "@core/ui/Icons/Icon";

function Profile() {
  const [credentials, setCredentials] = useState();
  const [isEditable, setIsEditable] = useState(false);
  const [editCreds, setEditCreds] = useState(false);
  const editToggle = () => setIsEditable(!isEditable);
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisible = () => setIsVisible(!isVisible);
  const { user, editUser } = useUser();

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
  return (
    <div className={classes.profile_wrapper}>
      <div className={classes.container}>
        <ProfileForm
          credentials={credentials}
          handleOnChange={handleOnChange}
          isEditable={isEditable}
          isEmailValid={isEmailValid}
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
            onAction={() => {
              editToggle();
              editUser(user._id, credentials, setIsEditable);
            }}
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
                      <Icon
                        name="Eye"
                        size={16}
                        color="white"
                        strokeWidth={3}
                      />
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
                      <Icon
                        name="Eye"
                        size={16}
                        color="white"
                        strokeWidth={3}
                      />
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
                  <Icon
                    name="Check"
                    size={16}
                    color="#EDF1FF"
                    strokeWidth={3}
                  />
                }
              />
            </div>
          </>
        )}
      </div>
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

export default Profile;
