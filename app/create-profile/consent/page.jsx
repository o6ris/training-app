"use client";

import { useState, useEffect, useTransition } from "react";
import classes from "./consent.module.css";
import useUser from "@modules/client/requests/useUser";
import { Switch } from "@heroui/react";
import ButtonLink from "@core/ui/Button/ButtonLink";
import BasicButton from "@core/ui/Button/BasicButton";
import ClipLoader from "react-spinners/ClipLoader";

function ConsentPage() {
  const [credentials, setCredentials] = useState();
  const [isPending, startTransition] = useTransition();
  const { user, editUser } = useUser();

  useEffect(() => {
    setCredentials(user);
  }, [user]);

  const switchStyle = {
    base: classes.switch_base,
    wrapper: classes.switch_wrapper,
    label: classes.switch_label,
  };
  return (
    <div className={classes.switch_content}>
      <Switch
        color="secondary"
        isSelected={credentials?.policy}
        onValueChange={(value) =>
          setCredentials((prevCredentials) => ({
            ...prevCredentials,
            policy: value,
            first_connexion: false,
          }))
        }
        classNames={switchStyle}
      >
        I agree to the Privacy Policy and Terms of Service.
      </Switch>
      <Switch
        color="secondary"
        isSelected={credentials?.newsletter}
        onValueChange={(value) =>
          setCredentials((prevCredentials) => ({
            ...prevCredentials,
            newsletter: value,
          }))
        }
        classNames={switchStyle}
      >
        Unlock exclusive tips, updates, and special offers from GrindPal. (No
        worries, you can hit &apos;unsubscribe&apos; anytime!)
      </Switch>
      {!credentials.policy ? (
        <BasicButton
          isDisabled={true}
          buttonContent="Start Working out"
          buttonStyle={classes.start_button}
        />
      ) : (
        <ButtonLink
          url={"/home"}
          onAction={() =>
            startTransition(() => {
              editUser(user._id, credentials, null);
            })
          }
          buttonContent={
            isPending ? (
              <ClipLoader
                color={"#EDF1FF"}
                loading={isPending}
                size={20}
                aria-label="Loading Spinner"
              />
            ) : (
              "Start Working out"
            )
          }
          buttonStyle={classes.start_button}
        />
      )}
    </div>
  );
}

export default ConsentPage;
