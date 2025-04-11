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
      <div className="flex gap-2">
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
          id="agree-policy"
        />

        <label htmlFor="agree-policy" className="cursor-pointer text-sm">
          I agree to the{" "}
          <a
            href="/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
            onClick={(e) => e.stopPropagation()}
          >
            Privacy Policy
          </a>{" "}
          and{" "}
          <a
            href="/terms-of-use"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
            onClick={(e) => e.stopPropagation()}
          >
            Terms of use
          </a>
          .
        </label>
      </div>

      <div className="flex gap-2">
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
          id="newsletter-switch"
        />

        <label htmlFor="newsletter-switch" className="cursor-pointer text-sm">
          Unlock exclusive tips, updates, and special offers from GrindPal. (No
          worries, you can hit &apos;unsubscribe&apos; anytime!)
        </label>
      </div>
      {!credentials?.policy ? (
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
