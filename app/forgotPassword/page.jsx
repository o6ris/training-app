"use client";

import { useState, useEffect } from "react";
import classes from "./forgotPassword.module.css";
import InputField from "@core/ui/Fields/InputField/InputField";
import BasicButton from "@core/ui/Button/BasicButton";
import useRequestReset from "@modules/client/requests/useResetPassword";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isError, setIsError] = useState({});
  const [disabledButton, setDisabledButton] = useState(true);
  const validateEmail = /^[a-z0-9._-]+@([a-z0-9-]+\.)+[a-z]{2,4}$/;
  const isEmailValid = validateEmail.test(email);
  const { getNewPassword, message } = useRequestReset();

  useEffect(() => {
    if (isEmailValid) {
      setDisabledButton(false);
    } else {
      setDisabledButton(true);
    }
  }, [validateEmail]);

  useEffect(() => {
    if (isError) {
      const timer = setTimeout(() => {
        setIsError(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isError]);

  return (
    <div className={classes.main_wrapper}>
      <h1>Forgot your password?</h1>
      <p>Enter your email to get a new password</p>
      <form className={classes.form}>
        {message &&
          (String(message?.status).startsWith("40") ? (
            <div className={classes.error_message}>{message.message}</div>
          ) : (
            <div className={classes.ok_message}>{message.message}</div>
          ))}
        <InputField
          placeholder="eg: jonh@mail.com"
          value={email}
          onChange={(value) => setEmail(value)}
          label="Email"
          labelPlacement="outside"
          variant="bordered"
          errorMessage={
            isError.status === 403
              ? "Email doesn't exist"
              : "Something went wrong."
          }
        />
        <BasicButton
          buttonStyle={classes.button}
          buttonContent={"Reset my password"}
          isDisabled={disabledButton}
          onAction={() => getNewPassword(email)}
        />
      </form>
    </div>
  );
}

export default ForgotPassword;
