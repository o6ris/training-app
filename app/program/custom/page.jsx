"use client";

import CreateSessions from "@components/CreateSessions/CreateSessions";
import CreatePlanning from "@components/CreatePlanning/CreatePlanning";
import { useSearchParams } from "next/navigation";
import classes from "./programCustom.module.css";

function ProgramCustom() {
  const searchParams = useSearchParams();
  const stepNbr = searchParams.get("step");

  return (
    <div className={classes.program_container}>
      {stepNbr === "1" && <CreateSessions />}
      {stepNbr === "2" && <CreatePlanning />}

    </div>
  );
}

export default ProgramCustom;
