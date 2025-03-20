"use client";

import { useState, useTransition, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import classes from "./createWorkout.module.css";
import useExercises from "@modules/client/requests/useExercises";
import useWorkoutSession from "@modules/client/requests/useWorkoutSession";
import SetupWorkout from "@components/SetupWorkout/SetupWorkout";
import ChooseExercises from "@components/ChooseExercises/ChooseExercises";
import checkId from "@modules/server/utils/checkId";

function CreateWorkout({ muscles }) {
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

  const {
    saveWorkoutSession,
    getOneWorkoutSession,
    updateWorkoutSession,
    changeOneWorkoutName,
    addWorkoutExercise,
    deleteWorkoutExercise,
    oneWorkout,
  } = useWorkoutSession();

  const searchParams = useSearchParams();
  const workoutId = searchParams.get("id");

  useEffect(() => {
    if (workoutId && checkId(workoutId)) {
      getOneWorkoutSession(workoutId);
    }
  }, []);

  useEffect(() => {
    if (muscleId.length === 0) setMuscleId(["all"]);
  }, [muscleId]);

  return (
    <>
      <div className={classes.session_container}>
        {!displayAddExercise ? (
          <SetupWorkout
            selectedExercises={selectedExercises}
            setDisplayAddExercise={setDisplayAddExercise}
            removeExercise={removeExercise}
            workoutId={workoutId}
            saveWorkoutSession={saveWorkoutSession}
            updateWorkoutSession={updateWorkoutSession}
            oneWorkout={oneWorkout}
            changeOneWorkoutName={changeOneWorkoutName}
            deleteWorkoutExercise={deleteWorkoutExercise}
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
            isLoading={isLoading}
            workoutId={workoutId}
            addWorkoutExercise={addWorkoutExercise}
            deleteWorkoutExercise={deleteWorkoutExercise}
            oneWorkout={oneWorkout}
          />
        )}
      </div>
    </>
  );
}

export default CreateWorkout;
