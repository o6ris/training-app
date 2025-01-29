import { useState } from "react";
import classes from "./login.module.css";
import { useSession, signIn } from "next-auth/react";
import InputField from "@core/ui/Fields/InputField/InputField";
import BasicButton from "@core/ui/Button/BasicButton";
import Image from "node_modules/next/image";
import Link from "next/link";

function Login() {
  const [credentials, setCredentials] = useState();
  const handleOnChange = (name, value) => {
    const t = { ...credentials };
    t[name] = value;
    setCredentials(t);
  };
  const session = useSession();
  const handleLogin = async () => {
    const res = await signIn("credentials", {
      redirect: false,
      email: credentials.email,
      password: credentials.password,
    });
    if (res.ok) {
      return res;
    } else {
      console.error(res.error);
    }
  };
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
      <BasicButton
        onAction={() => handleLogin()}
        buttonContent={"Login"}
        buttonStyle={classes.login_creds}
      />
      <div className={classes.signup_section}>
        <p>don&apos;t have an account ?</p>
        <Link className={classes.signup_button} href="/signup">Sign up</Link>
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
