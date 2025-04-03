import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import classes from "./signup.module.css";
import useUser from "@modules/client/requests/useUser";
import InputField from "@core/ui/Fields/InputField/InputField";
import BasicButton from "@core/ui/Button/BasicButton";
import Icon from "@core/ui/Icons/Icon";

function Signup() {
  const { addUser } = useUser();
  const [credentials, setCredentials] = useState({
    password: "",
    confirmedPassword: "",
  });
  const [isError, setIsError] = useState({});
  const [disabledButton, setDisabledButton] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisible = () => setIsVisible(!isVisible);
  const validateEmail = /^[a-z0-9._-]+@([a-z0-9-]+\.)+[a-z]{2,4}$/;
  const isEmailValid = validateEmail.test(credentials.email);
  const isPasswordSame =
    credentials?.password === credentials?.confirmedPassword &&
    (credentials?.password !== "" || credentials?.confirmedPassword !== "");
  // const router = useRouter();
  const handleOnChange = (name, value) => {
    const t = { ...credentials };
    t[name] = value;
    setCredentials(t);
  };

  useEffect(() => {
    if (isPasswordSame && isEmailValid) {
      setDisabledButton(false);
    } else {
      setDisabledButton(true);
    }
  }, [isPasswordSame, validateEmail]);

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
        isInvalid={isError.bool}
        errorMessage={
          isError.status === 403
            ? "Access denined (not white listed?)"
            : "Credentials are incorrect."
        }
      />
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
        onAction={() => addUser(credentials)}
        buttonContent={"Sign up"}
        buttonStyle={classes.signup_button}
        isDisabled={disabledButton}
      />
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
      <div className={classes.go_back_button}>
        <Link href="/login">Back to login</Link>
      </div>
    </div>
  );
}

export default Signup;
