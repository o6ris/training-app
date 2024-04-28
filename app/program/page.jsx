import React from "react";
import classes from "./program.module.css";
import SelectField from "@core/ui/Fields/SelectField/SelectField";
import ButtonLink from "@core/ui/Button/ButtonLink";

function page() {
  const users = [
    {
      id: 1,
      value: "Push pull legs",
      desc: "tony.reichert@example.com",
    },
    {
      id: 2,
      value: "Full body",
      desc: "zoey.lang@example.com",
    },
    {
      id: 3,
      value: "Upper lower split",
      desc: "jane.fisher@example.com",
    },
    {
      id: 4,
      value: "Doggcrap Training",
      desc: "william.howard@example.com",
    },
    {
      id: 5,
      value: "Kristen Copper Training",
      desc: "kristen.cooper@example.com",
    },
    {
      id: 6,
      value: "Another training",
      desc: "brian.kim@example.com",
    },
  ];
  return (
    <div className={classes.container}>
      <SelectField
        items={users}
        variant="bordered"
        label="Program"
        placeholder="Choose a program"
        labelPlacement="outside"
      />
      <p className="font-black">OR</p>
      <ButtonLink buttonStyle={classes.link_button} url="/" buttonContent="Create a program" />
    </div>
  );
}

export default page;
