"use client";

import { useState, useContext, useTransition } from "react";
import { useRouter } from "next/navigation";
import classes from "./createSession.module.css";
import useExercises from "@modules/client/requests/useExercises";
import SetupWorkout from "@components/SetupWorkout/SetupWorkout";
import ChooseExercises from "@components/ChooseExercises/ChooseExercises";

function CreateSession({ muscles }) {
  const [displayAddExercise, setDisplayAddExercise] = useState(false);
  const [muscleId, setMuscleId] = useState([]);

  const [isPending, startTransition] = useTransition();
  const {
    selectedExercises,
    latestExercises,
    exercises,
    isLoading,
    addExercise,
    removeExercise,
  } = useExercises(muscleId, "muscle");

  console.log("selectedExercises", selectedExercises);

  return (
    <>
      <div className={classes.session_container}>
        {!displayAddExercise ? (
          <SetupWorkout
            selectedExercises={selectedExercises}
            setDisplayAddExercise={setDisplayAddExercise}
            removeExercise={removeExercise}
          />
        ) : (
          <ChooseExercises
            exercises={exercises}
            addExercise={addExercise}
            removeExercise={removeExercise}
            selectedExercises={selectedExercises}
            muscles={muscles}
            muscleId={muscleId}
            setMuscleId={setMuscleId}
            setDisplayAddExercise={setDisplayAddExercise}
          />
        )}
      </div>
    </>
  );
}

export default CreateSession;
