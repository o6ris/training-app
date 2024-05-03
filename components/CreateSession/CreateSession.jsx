"use client";

import { useState, useEffect, useMemo } from "react";
import classes from "app/program/custom/programCustom.module.css";
import SelectField from "@core/ui/Fields/SelectField/SelectField";
import InputField from "@core/ui/Fields/InputField/InputField";
import ColorsField from "@core/ui/Fields/ColorsField/ColorsField";
import BasicButton from "@core/ui/Button/BasicButton";
import { Accordion, AccordionItem } from "@nextui-org/react";
import Icon from "@core/ui/Icons/Icon";

function CreateSession() {
  const [accordionKey, setAccordionKey] = useState(new Set(["1"]));
  const [muscles, setMuscles] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [onHover, setOnHover] = useState([false]);

  const selectedAccordion = useMemo(
    () => Array.from(accordionKey).join(""),
    [accordionKey]
  );

  const [sessions, setSessions] = useState([
    {
      muscles: [],
      exercises: [],
      name: "",
      color: "",
    },
  ]);

  const handleOnHover = (i, isShowed) => {
    const t = [...onHover];
    t[i] = isShowed;
    setOnHover(t);
  };

  const handleOnChangeSession = (i, name, value) => {
    const arrayTemp = [...sessions];
    const objTemp = { ...arrayTemp[i] };
    objTemp[name] = value;
    arrayTemp[i] = objTemp;
    setSessions(arrayTemp);
  };

  const handleAddSession = () => {
    const tempSessions = [...sessions];
    const newSession = {
      muscles: [],
      exercises: [],
      name: "",
      color: "",
    };
    tempSessions.push(newSession);
    setSessions(tempSessions);
    setAccordionKey(new Set([tempSessions.length.toString()]));
  };

  const handleRemoveSession = (e, i) => {
    e.stopPropagation();
    const t = [...sessions];
    t.splice(i, 1);
    setSessions(t);
  };

  console.log("sessions", sessions);
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
      const queryString = sessions[parseInt(selectedAccordion - 1)].muscles
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
    if (sessions[parseInt(selectedAccordion - 1)]?.muscles.length > 0) {
      getExercises();
    }
  }, [sessions[parseInt(selectedAccordion - 1)]?.muscles, selectedAccordion]);

  return (
    <>
      <Accordion
        selectedKeys={accordionKey}
        onSelectionChange={setAccordionKey}
        variant="light"
      >
        {sessions.map((session, i) => {
          const key = (i + 1).toString();
          return (
            <AccordionItem
              key={key}
              title={
                <div
                  onMouseEnter={() => handleOnHover(i, true)}
                  onMouseLeave={() => handleOnHover(i, false)}
                  className={classes.title_container}
                >
                  <h3>Session {i + 1}</h3>
                  {onHover[i] && sessions.length > 1 && (
                    <button onClick={(e) => handleRemoveSession(e, i)}>
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
                    handleOnChangeSession(i, "muscles", Array.from(value))
                  }
                  value={sessions[i].muscles}
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
                    handleOnChangeSession(i, "exercises", Array.from(value))
                  }
                  value={sessions[i].exercises}
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
                  onChange={(value) => handleOnChangeSession(i, "name", value)}
                />
                {/* Choose session color */}
                <ColorsField
                  value={sessions[i].color}
                  onChange={handleOnChangeSession}
                  index={i}
                />
              </div>
            </AccordionItem>
          );
        })}
      </Accordion>
      <BasicButton
        onAction={() => handleAddSession()}
        buttonContent={"+ Add session"}
        buttonStyle={classes.add_session_button}
      />
    </>
  );
}

export default CreateSession;
