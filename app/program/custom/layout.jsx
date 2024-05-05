"use client";

import { useState, useContext, useEffect } from "react";
import classes from "./programCustom.module.css";
import ProgramContext from "@modules/client/contexts/programProvider";
import ButtonLink from "@core/ui/Button/ButtonLink";
import { useSearchParams } from "next/navigation";
import { ValidateIcon } from "@core/ui/Icons/ValidateIcon";

function ProgramCustomLayout({ children }) {
  const { program, setProgram } = useContext(ProgramContext);
  console.log("program", program);
  const searchParams = useSearchParams();
  const stepNbr = searchParams.get("step");

  useEffect(() => {
    const program = localStorage.getItem("program");
    if (program) {
      setProgram(JSON.parse(program));
    }
  }, []);

  // TODO: implement steps
  // const [steps, setSteps] = useState([
  //   {
  //     validate: false,
  //   },
  //   {
  //     validate: false,
  //   },
  //   {
  //     validate: false,
  //   },
  //   {
  //     validate: false,
  //   },
  // ]);

  // const stepOnChange = (index, name, value) => {
  //   // console.log(index)
  //   const tempArr = [...steps];
  //   const tempObj = { ...tempArr[index - 1] };
  //   tempObj[name] = value;
  //   tempArr[index - 1] = tempObj;
  //   setSteps(tempArr);
  // }

  const renderUrl = (nextStep) => {
    if (nextStep) {
      if (stepNbr >= 1 && stepNbr < 4) {
        return `custom?step=${parseInt(stepNbr) + 1}`;
      } else {
        return "";
      }
    } else {
      if (parseInt(stepNbr) === 1) {
        return "";
      } else {
        return `custom?step=${parseInt(stepNbr) - 1}`;
      }
    }
  };

  return (
    <div className={classes.layout_container}>
      <div className={classes.layout_content}>
        <h1>Customize your program</h1>
        {/* TODO: implement steps display */}
        {/* <div className={classes.steps}>
          {steps.map((step, index) => (
            <div key={index} className={classes.step}>
              {step.validate && <ValidateIcon fill={"#02091C"} />}
            </div>
          ))}
        </div> */}
        <div className={classes.step_desc}>
          <span>Step {stepNbr} out of 4</span>
          <h2>Choose your sessions</h2>
        </div>
      </div>
      {children}
      <ButtonLink
        buttonStyle={classes.link_button}
        url={renderUrl(true)}
        buttonContent="Next Step"
        onAction={() => stepOnChange(parseInt(stepNbr), "validate", true)}
      />
      <ButtonLink
        buttonStyle={classes.link_button}
        url={renderUrl(false)}
        buttonContent="Previous Step"
        onAction={() => stepOnChange(parseInt(stepNbr) - 1, "validate", false)}
      />
    </div>
  );
}

export default ProgramCustomLayout;
