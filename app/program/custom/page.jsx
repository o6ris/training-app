"use client";

import CreateSession from "@components/CreateSession/CreateSession";
import CreatePlanning from "@components/CreatePlanning/CreatePlanning";
import { useSearchParams } from "next/navigation";
import classes from "./programCustom.module.css";

function ProgramCustom() {
  const searchParams = useSearchParams();
  const stepNbr = searchParams.get("step");

  return (
    <div className={classes.program_container}>
      {stepNbr === "1" && <CreateSession />}
      {stepNbr === "2" && <CreatePlanning />}

    </div>
  );
}

export default ProgramCustom;
