"use client";

import classes from "./profile.module.css";
import BasicButton from "@core/ui/Button/BasicButton";
import { signOut } from "next-auth/react";

function page() {
  return (
    <div>
      <BasicButton
        onAction={() => signOut({ callbackUrl: "/login" })}
        buttonContent={"Logout"}
        buttonStyle={classes.logout_button}
      />
    </div>
  );
}

export default page;
