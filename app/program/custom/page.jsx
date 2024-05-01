import CreateSession from "@components/CreateSession/CreateSession";
import classes from "./programCustom.module.css";

function ProgramCustom() {
  return (
    <div className={classes.program_container}>
      <CreateSession />
    </div>
  );
}

export default ProgramCustom;
