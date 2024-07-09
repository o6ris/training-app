import { useState, useEffect, useMemo, useContext } from "react";
import classes from "app/program/custom/programCustom.module.css";
import ProgramContext from "@modules/client/contexts/programProvider";
import SliderField from "@core/ui/Fields/SliderField/SliderField";
import DaysField from "@core/ui/Fields/DaysField/DaysField";

function CreatePlanning() {
  const { program, handleOnChangeProgram } = useContext(ProgramContext);
  return (
    <div className={classes.sub_program_container}>
      <SliderField
        label="Choose frequency"
        color="secondary"
        value={program.frequency}
        onChange={(value) => {
          handleOnChangeProgram("frequency", value);
        }}
      />
      <DaysField
        label="Choose your training days"
        items={program.sessions.map((session) => {
          return {
            key: session._id,
            value: `${session.name.charAt(0).toUpperCase()}${session.name.slice(
              1
            )}`,
          };
        })}
      />
    </div>
  );
}

export default CreatePlanning;
