"use client";

import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
import classes from "./login.module.css";
import { signIn } from "next-auth/react";
import InputField from "@core/ui/Fields/InputField/InputField";
import BasicButton from "@core/ui/Button/BasicButton";
// import PopupButton from "@core/ui/Button/PopupButton";
import Image from "next/image";
import Link from "next/link";
import Icon from "@core/ui/Icons/Icon";

function Login() {
  const [credentials, setCredentials] = useState();
  const [isError, setIsError] = useState({});
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

  // const router = useRouter();

  const handleLogin = async () => {
    const res = await signIn("credentials", {
      redirect: false,
      email: credentials.email,
      password: credentials.password,
    });
    if (res.ok) {
      return res;
    } else {
      setIsError({ status: res.status, bool: true });
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
            isIconOnly={true}
            onAction={toggleVisible}
          />
        }
      />
      <Link className={classes.forgot_paswword} href="/forgotPassword">
        Forgot your password?
      </Link>
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
      <hr />
      {/* <PopupButton
        triggerButtonContent={"Get Whitelisted"}
        buttonStyle={`${classes.login_google} ${classes.whitelisted_button}`}
        title={"Why join the Whitelist?"}
        confirmButton="Join!"
        onConfirm={() => router.push("https://forms.gle/HPNRcuLnmLnvMBwo6")}
        autoOpen={true}
        content={
          <div className={classes.whilisted_modal_content}>
            <p>
              This version of the app is a{" "}
              <strong>V0, an early MVP (Minimum Viable Product)</strong>. That
              means it&apos;s still in <strong>testing mode</strong>, and I need a
              small group of users to help shape it before a full release.
            </p>
            <p>
              By getting whitelisted, you&apos;ll be part of an{" "}
              <strong>exclusive group of early testers</strong> who will:
            </p>
            <ul>
              <li>
                ✅ <strong>Try out new features</strong> before anyone else
              </li>
              <li>
                ✅ <strong>Give feedback</strong> on what works and what doesn&apos;t
              </li>
              <li>
                ✅ <strong>Report bugs</strong> and suggest improvements
              </li>
            </ul>
            <p>
              Your insights will be <strong>crucial</strong> in making the app
              better. If you&apos;re interested in testing and shaping the future of
              this app,
              🚀
            </p>
          </div>
        }
      /> */}
    </div>
  );
}

export default Login;
