import { useState, useEffect } from "react";
import classes from "./signup.module.css";
import useUser from "@modules/client/userRequests/useUser";
import InputField from "@core/ui/Fields/InputField/InputField";
import BasicButton from "@core/ui/Button/BasicButton";

function Signup() {
  const { addUser } = useUser();
  const [credentials, setCredentials] = useState({
    password: "",
    confirmedPassword: "",
  });
  const [disabledButton, setDisabledButton] = useState(true);
  const validateEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const handleOnChange = (name, value) => {
    const t = { ...credentials };
    t[name] = value;
    setCredentials(t);
  };

  useEffect(() => {
    if (
      credentials?.password === credentials?.confirmedPassword &&
      (credentials?.password !== "" || credentials?.confirmedPassword !== "") && 
      validateEmail.test(credentials.email)
    ) {
      setDisabledButton(false);
    } else {
      setDisabledButton(true);
    }
  }, [credentials, validateEmail]);

  return (
    <div className={classes.container}>
      <InputField
        label="Email"
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
      />
      <InputField
        label="Confirm Password"
        variant="bordered"
        placeholder=""
        labelPlacement="outside"
        onChange={(value) => handleOnChange("confirmedPassword", value)}
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
