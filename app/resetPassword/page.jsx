"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import classes from "./resetPassword.module.css";
import useResetPassword from "@modules/client/requests/useResetPassword";
import InputField from "@core/ui/Fields/InputField/InputField";
import BasicButton from "@core/ui/Button/BasicButton";
import Icon from "@core/ui/Icons/Icon";

function ResetPassword() {
  const { createNewPassword, message } = useResetPassword();
  const [credentials, setCredentials] = useState({
    password: "",
    confirmedPassword: "",
  });
  const [isError, setIsError] = useState({});
  const [disabledButton, setDisabledButton] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisible = () => setIsVisible(!isVisible);
  const isPasswordSame =
    credentials?.password === credentials?.confirmedPassword &&
    (credentials?.password !== "" || credentials?.confirmedPassword !== "");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleOnChange = (name, value) => {
    const t = { ...credentials };
    t[name] = value;
    setCredentials(t);
  };

  useEffect(() => {
    if (isPasswordSame) {
      setDisabledButton(false);
    } else {
      setDisabledButton(true);
    }
  }, [isPasswordSame]);

  useEffect(() => {
    if (isError) {
      const timer = setTimeout(() => {
        setIsError(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isError]);

  return (
    <div className={classes.container}>
      <h1>Reset Password</h1>
      {message &&
        (String(message?.status).startsWith("40") ? (
          <div className={classes.error_message}>{message.message}</div>
        ) : (
          <div className={classes.ok_message}>{message.message}</div>
        ))}
      <InputField
        label="Password"
        variant="bordered"
        placeholder=""
        labelPlacement="outside"
        onChange={(value) => handleOnChange("password", value)}
        type={isVisible ? "text" : "password"}
        isInvalid={isError.bool}
        errorMessage={
          isError.status === 403
            ? "Access denined (not white listed?)"
            : "Credentials are incorrect."
        }
        endContent={
          <BasicButton
            buttonStyle={classes.visible_button}
            buttonContent={
              isVisible ? (
                <Icon name="Eye" size={16} color="white" strokeWidth={3} />
              ) : (
                <Icon name="EyeOff" size={16} color="white" strokeWidth={3} />
              )
            }
            isInvalid={isError.bool}
            errorMessage={
              isError.status === 403
                ? "Access denined (not white listed?)"
                : "Credentials are incorrect."
            }
            isIconOnly={true}
            onAction={toggleVisible}
          />
        }
      />
      <InputField
        label={
          <>
            Confirm password{" "}
            {!isPasswordSame && <span>(add same password)</span>}
          </>
        }
        variant="bordered"
        placeholder=""
        labelPlacement="outside"
        onChange={(value) => handleOnChange("confirmedPassword", value)}
        type={isVisible ? "text" : "password"}
        isInvalid={isError.bool}
        errorMessage={
          isError.status === 403
            ? "Access denined (not white listed?)"
            : "Credentials are incorrect."
        }
        endContent={
          <BasicButton
            buttonStyle={classes.visible_button}
            buttonContent={
              isVisible ? (
                <Icon name="Eye" size={16} color="white" strokeWidth={3} />
              ) : (
                <Icon name="EyeOff" size={16} color="white" strokeWidth={3} />
              )
            }
            isIconOnly={true}
            onAction={toggleVisible}
          />
        }
      />
      <BasicButton
        onAction={() => createNewPassword(token, credentials.password)}
        buttonContent={"Reset Password"}
        buttonStyle={classes.reset_button}
        isDisabled={disabledButton}
      />
    </div>
  );
}

export default ResetPassword;
