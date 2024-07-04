"use client";

import { useState, useEffect, useMemo, useContext } from "react";
import classes from "app/program/custom/programCustom.module.css";
import ProgramContext from "@modules/client/contexts/programProvider";
import SelectField from "@core/ui/Fields/SelectField/SelectField";
import InputField from "@core/ui/Fields/InputField/InputField";
import ColorsField from "@core/ui/Fields/ColorsField/ColorsField";
import BasicButton from "@core/ui/Button/BasicButton";
import { Accordion, AccordionItem } from "@nextui-org/react";
import Icon from "@core/ui/Icons/Icon";

// NOT USED YET MAYBE IN THE FUTURE
function CreateSession() {
  const {
    program,
    handleOnChangeProgram,
    handleAddSession,
    handleRemoveSession,
  } = useContext(ProgramContext);
  const [accordionKey, setAccordionKey] = useState(new Set(["1"]));
  const [muscles, setMuscles] = useState([]);
  const [exercises, setExercises] = useState([]);

  const selectedAccordion = useMemo(
    () => Array.from(accordionKey).join(""),
    [accordionKey]
  );

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const getMuscles = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/api/muscles`,
        { method: "GET" },
        { next: { revalidate: 10 } }
      );
      if (response) {
        const muscles = await response.json();
        if (muscles) {
          setMuscles(muscles);
        }
      }
    } catch (err) {
      throw err;
    }
  };

  const getExercises = async () => {
    try {
      const queryString = program.sessions[
        parseInt(selectedAccordion - 1)
      ].muscles
        .map((muscleId) => `muscle=${muscleId}`)
        .join("&");
      const url = `${baseUrl}/api/exercises?${queryString}`;
      const response = await fetch(
        url,
        { method: "GET" },
        { next: { revalidate: 10 } }
      );
      if (response) {
        const exercises = await response.json();
        if (exercises) {
          setExercises(exercises);
        }
      }
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    getMuscles();
  }, []);

  useEffect(() => {
    if (program.sessions[parseInt(selectedAccordion - 1)]?.muscles.length > 0) {
      getExercises();
    }
  }, [
    program.sessions[parseInt(selectedAccordion - 1)]?.muscles,
    selectedAccordion,
  ]);

  return (
    <>
      <Accordion
        selectedKeys={accordionKey}
        onSelectionChange={setAccordionKey}
        variant="light"
      >
        {program.sessions.map((session, i) => {
          const key = (i + 1).toString();
          return (
            <AccordionItem
              key={key}
              title={
                <div className={classes.title_container}>
                  <h3>Session {i + 1}</h3>
                  {program.sessions.length > 1 && (
                    <button onClick={(e) => handleRemoveSession(i)}>
                      <Icon name="Trash" size={14} color="red" />
                    </button>
                  )}
                </div>
              }
            >
              <div className={classes.sub_program_container}>
                {/* Choose muscles */}
                <SelectField
                  items={muscles?.map((muscle) => {
                    return {
                      key: muscle._id,
                      value: `${muscle.name
                        .charAt(0)
                        .toUpperCase()}${muscle.name.slice(1)}`,
                    };
                  })}
                  label="Muscle"
                  placeholder="Choose muscle"
                  labelPlacement="outside"
                  variant="bordered"
                  selectOnChange={(value) =>
                    handleOnChangeProgram("muscles", Array.from(value), i, "sessions")
                  }
                  value={program.sessions[i].muscles}
                  isMultiline={true}
                  selectionMode="multiple"
                />
                {/* Choose Exercises */}
                <SelectField
                  items={exercises?.map((exercise) => {
                    return {
                      key: exercise._id,
                      value: `${exercise.name
                        .charAt(0)
                        .toUpperCase()}${exercise.name.slice(1)}`,
                    };
                  })}
                  label="Exercises"
                  placeholder="Choose exercises"
                  labelPlacement="outside"
                  variant="bordered"
                  selectOnChange={(value) =>
                    handleOnChangeProgram("exercises", Array.from(value), i, "sessions")
                  }
                  value={program.sessions[i].exercises}
                  isMultiline={true}
                  selectionMode="multiple"
                />
                {/* Choose session name */}
                <InputField
                  label="Session name"
                  variant="bordered"
                  placeholder="Exemple: PUSH"
                  labelPlacement="outside"
                  value={session.name}
                  onChange={(value) => handleOnChangeProgram("name", value, i, "sessions")}
                />
                {/* Choose session color */}
                <ColorsField
                  value={program.sessions[i].color}
                  onChange={handleOnChangeProgram}
                  index={i}
                  section="sessions"
                  label="Choose color session"
                />
              </div>
            </AccordionItem>
          );
        })}
      </Accordion>
      <BasicButton
        onAction={() => handleAddSession(setAccordionKey)}
        buttonContent={"+ Add session"}
        buttonStyle={classes.add_session_button}
      />
    </>
  );
}

export default CreateSession;
