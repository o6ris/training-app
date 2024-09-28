"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import classes from "./profile.module.css";
import InputField from "@core/ui/Fields/InputField/InputField";
import BasicButton from "@core/ui/Button/BasicButton";
import useUser from "@modules/client/userRequests/useUser";

function page() {
  const [credentials, setCredentials] = useState();
  const [isEditable, setIsEditable] = useState(false);
  const editToggle = () => setIsEditable(!isEditable);
  const { data: userSession, status } = useSession();
  const { user, editUser } = useUser(userSession);

  useEffect(() => {
    setCredentials(user);
  }, [user]);

  const handleOnChange = (name, value) => {
    const t = { ...credentials };
    t[name] = value;
    setCredentials(t);
  };

  return (
    <div className={classes.container}>
      <InputField
        label={"Name"}
        variant="bordered"
        placeholder="john"
        labelPlacement="outside"
        value={credentials?.name}
        onChange={(value) => handleOnChange("name", value)}
      />
      <InputField
        variant="bordered"
        label="Age"
        placeholder="35"
        labelPlacement="outside"
        value={credentials?.age}
        type="number"
        endContent={"years"}
        onChange={(value) => handleOnChange("age", value)}
      />
      <InputField
        variant="bordered"
        label="Height"
        placeholder="170"
        labelPlacement="outside"
        value={credentials?.height}
        type="number"
        endContent={"cm"}
        onChange={(value) => handleOnChange("height", value)}
      />
      <InputField
        variant="bordered"
        label="Weight"
        placeholder="70"
        labelPlacement="outside"
        value={credentials?.weight}
        type="number"
        endContent={"kg"}
        onChange={(value) => handleOnChange("weight", value)}
      />
      {/* <InputField
        label={"Email"}
        variant="bordered"
        placeholder="john.doe@mail.com"
        labelPlacement="outside"
        value={credentials?.email}
        onChange={(value) => handleOnChange("email", value)}
      /> */}
      <div className={classes.button_wrapper}>
        <BasicButton
          onAction={editToggle}
          buttonContent={isEditable ? "Cancel" : "Edit"}
          buttonStyle={classes.button}
        />
        <BasicButton
          onAction={() => editUser(user._id, credentials)}
          buttonContent={"Validate"}
          buttonStyle={classes.button}
          isDisabled={!isEditable}
        />
      </div>
      <BasicButton
        onAction={() => signOut({ callbackUrl: "/login" })}
        buttonContent={"Logout"}
        buttonStyle={classes.logout_button}
      />
    </div>
  );
}

export default page;
