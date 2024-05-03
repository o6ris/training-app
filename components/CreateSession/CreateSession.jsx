"use client";

import { useState, useEffect, useMemo } from "react";
import SelectField from "@core/ui/Fields/SelectField/SelectField";
import InputField from "@core/ui/Fields/InputField/InputField";
import ColorsField from "@core/ui/Fields/ColorsField/ColorsField";
import { Accordion, AccordionItem } from "@nextui-org/react";
import classes from "app/program/custom/programCustom.module.css";

function CreateSession() {
  const [accordionKey, setAccordionKey] = useState(new Set(["1"]));
  const [muscles, setMuscles] = useState([]);
  const [exercises, setExercises] = useState([]);

  const [muscleIds, setMuscleIds] = useState(new Set([]));
  const [exerciseIds, setExerciseIds] = useState(new Set([]));

  const selectedAccordion = useMemo(
    () => Array.from(accordionKey).join(""),
    [accordionKey]
  );
  const selectedMuscles = useMemo(() => Array.from(muscleIds), [muscleIds]);
  const selectedExercises = useMemo(
    () => Array.from(exerciseIds),
    [exerciseIds]
  );

  const [sessions, setSessions] = useState([
    {
      exercises: [],
      name: "",
      color: "",
    },
  ]);
  console.log(sessions)

  const handleOnChangeSession = (i, name, value) => {
    const arrayTemp = [...sessions];
    const objTemp = { ...arrayTemp[i] };
    objTemp[name] = value;
    arrayTemp[i] = objTemp;
    setSessions(arrayTemp);
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
      const queryString = selectedMuscles
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
    if (selectedMuscles.length > 0) {
      getExercises();
    }
  }, [selectedMuscles]);

  useEffect(() => {
    handleOnChangeSession(
      parseInt(selectedAccordion - 1),
      "exercises",
      selectedExercises
    );
  }, [selectedExercises]);

  return (
    <Accordion
      selectedKeys={accordionKey}
      onSelectionOnChange={setAccordionKey}
      variant="light"
    >
      {sessions.map((session, i) => {
        return (
          <AccordionItem key="1" title={`Session ${i + 1}`}>
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
                selectOnChange={setMuscleIds}
                value={muscleIds}
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
                selectOnChange={setExerciseIds}
                value={exerciseIds}
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
              <ColorsField onChange={handleOnChangeSession} index={i} />
            </div>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

export default CreateSession;
