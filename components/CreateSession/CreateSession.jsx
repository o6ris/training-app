"use client";

import { useState, useEffect } from "react";
import classes from "./createSession.module.css";
import SelectField from "@core/ui/Fields/SelectField/SelectField";
import BasicButton from "@core/ui/Button/BasicButton";

function CreateSession() {
  const [muscles, setMuscles] = useState([]);
  const [muscleIds, setMusculeIds] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [exerciseIds, setExerciseIds] = useState([]);
  console.log("muscleIds", muscleIds);
  console.log("exercises", exercises);

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
      const queryString = muscleIds
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
    if (muscleIds.length > 0) {
      getExercises();
    }
  }, [muscleIds]);

  return (
    <>
      <div className={classes.session_container}>
        {/* Choose muscles */}
        <SelectField
          items={muscles?.map((muscle) => {
            return {
              key: muscle._id,
              value: `${muscle.name.charAt(0).toUpperCase()}${muscle.name.slice(
                1
              )}`,
            };
          })}
          label="Muscle"
          placeholder="Choose muscle"
          labelPlacement="outside"
          variant="bordered"
          selectOnChange={(value) => setMusculeIds(Array.from(value))}
          value={muscleIds}
          isMultiline={true}
          selectionMode="multiple"
        />
        {/* Choose Exercises */}
        {muscleIds.length > 0 && (
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
            selectOnChange={(value) => setExerciseIds(Array.from(value))}
            value={exerciseIds}
            isMultiline={true}
            selectionMode="multiple"
          />
        )}
      </div>
      <BasicButton
        onAction={() => handleAddSession(setAccordionKey)}
        buttonContent={"+ Add session"}
        buttonStyle={classes.add_session_button}
      />
    </>
  );
}

export default CreateSession;
