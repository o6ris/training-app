"use client";

import { useState, useEffect } from "react";
import classes from "./createprofile.module.css";
import ProfileForm from "@components/ProfileForm/ProfileForm";
import Link from "next/link";
import useUser from "@modules/client/requests/useUser";
import Icon from "@core/ui/Icons/Icon";

function CreateProfile() {
  const [credentials, setCredentials] = useState();
  const { user, editUser } = useUser();

  useEffect(() => {
    setCredentials(user);
  }, [user]);

  const handleOnChange = (name, value) => {
    const t = { ...credentials };
    t[name] = value;
    setCredentials(t);
  };

  return (
    <div className={classes.wrapper}>
      <h1>Complet your Profile</h1>
      <ProfileForm
        credentials={credentials}
        handleOnChange={handleOnChange}
        isEditable={true}
      />
      <div className={classes.footer}>
        <Link
          href="/create-profile/consent"
          onClick={() => editUser(user._id, credentials, null)}
        >
          Next <Icon name="MoveRight" />
        </Link>
      </div>
    </div>
  );
}

export default CreateProfile;
