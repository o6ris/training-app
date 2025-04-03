"use client";

import classes from "./profile.module.css"
import { signOut } from "next-auth/react";
import ProfileForm from "@components/ProfileForm/ProfileForm";
import BasicButton from "@core/ui/Button/BasicButton";
import Icon from "@core/ui/Icons/Icon";

function Profile() {
  return <div className={classes.profile_wrapper}>
    <ProfileForm />
    <BasicButton
        onAction={() => signOut({ callbackUrl: "/login" })}
        buttonContent={"Logout"}
        buttonStyle={`${classes.logout_button} ${classes.button}`}
        startContent={
          <Icon name="LogOut" size={16} color="#BA0505" strokeWidth={3} />
        }
      />
    </div>
}

export default Profile;
