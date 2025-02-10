"use client";

import { useState, useEffect } from "react";
import classes from "./login.module.css";
import { useSession, signIn } from "next-auth/react";
import InputField from "@core/ui/Fields/InputField/InputField";
import BasicButton from "@core/ui/Button/BasicButton";
import Image from "node_modules/next/image";
import Link from "next/link";
import Icon from "@core/ui/Icons/Icon";

function Login() {
  const [credentials, setCredentials] = useState();
  const [isError, setIsError] = useState();
  const [disabledButton, setDisabledButton] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisible = () => setIsVisible(!isVisible);
  const validateEmail = /^[a-z0-9._-]+@([a-z0-9-]+\.)+[a-z]{2,4}$/;
  const isEmailValid = validateEmail.test(credentials?.email);
  const handleOnChange = (name, value) => {
    const t = { ...credentials };
    t[name] = value;
    setCredentials(t);
  };

  const handleLogin = async () => {
    const res = await signIn("credentials", {
      redirect: false,
      email: credentials.email,
      password: credentials.password,
    });
    if (res.ok) {
      return res;
    } else {
      setIsError(true);
      console.error(res);
    }
  };

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
    <div className={classes.container}>
      <InputField
        label={<>Email {!isEmailValid && <span>(add valid format)</span>}</>}
        variant="bordered"
        placeholder="john.doe@mail.com"
        labelPlacement="outside"
        onChange={(value) => handleOnChange("email", value)}
        isInvalid={isError}
        errorMessage="Credentials are incorrect."
      />
      <InputField
        label="Password"
        variant="bordered"
        placeholder=""
        labelPlacement="outside"
        onChange={(value) => handleOnChange("password", value)}
        type={isVisible ? "text" : "password"}
        isInvalid={isError}
        errorMessage="Credentials are incorrect."
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
        onAction={() => handleLogin()}
        buttonContent={"Login"}
        buttonStyle={classes.login_creds}
        isDisabled={disabledButton}
      />
      <div className={classes.signup_section}>
        <p>don&apos;t have an account ?</p>
        <Link className={classes.signup_button} href="/signup">
          Sign up
        </Link>
      </div>
      OR
      <BasicButton
        onAction={() => signIn("google")}
        buttonContent={"Sign In with "}
        buttonStyle={classes.login_google}
        endContent={
          <Image
            src="/google-icon.png"
            width={18}
            height={18}
            alt="Picture of the author"
          />
        }
      />
    </div>
  );
}

export default Login;
