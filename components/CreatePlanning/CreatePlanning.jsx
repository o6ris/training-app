import { useState, useEffect, useMemo, useContext } from "react";
import classes from "app/program/custom/programCustom.module.css";
import ProgramContext from "@modules/client/contexts/programProvider";
import SliderField from "@core/ui/Fields/SliderField/SliderField";

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
    </div>
  );
}

export default CreatePlanning;
