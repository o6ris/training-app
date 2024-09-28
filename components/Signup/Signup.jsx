import { useState, useEffect } from "react";
import classes from "./signup.module.css";
import useUser from "@modules/client/userRequests/useUser";
import InputField from "@core/ui/Fields/InputField/InputField";
import BasicButton from "@core/ui/Button/BasicButton";
import Icon from "@core/ui/Icons/Icon";

function Signup() {
  const { addUser } = useUser();
  const [credentials, setCredentials] = useState({
    password: "",
    confirmedPassword: "",
  });
  const [disabledButton, setDisabledButton] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisible = () => setIsVisible(!isVisible);
  const validateEmail = /^[a-z0-9._-]+@([a-z0-9-]+\.)+[a-z]{2,4}$/;
  const isEmailValid = validateEmail.test(credentials.email);
  const isPasswordSame =
    credentials?.password === credentials?.confirmedPassword &&
    (credentials?.password !== "" || credentials?.confirmedPassword !== "");
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

  return (
    <div className={classes.container}>
      <InputField
        label={<>Email {!isEmailValid && <span>(add valid format)</span>}</>}
        variant="bordered"
        placeholder="john.doe@mail.com"
        labelPlacement="outside"
        onChange={(value) => handleOnChange("email", value)}
      />
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
                <Icon name="EyeOff" size={16} color="white" strokeWidth={3} />
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
            Confirm password{" "}
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
    </div>
  );
}

export default Signup;
