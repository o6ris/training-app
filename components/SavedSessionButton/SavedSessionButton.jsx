"use client";

import React from "react";
import PopupButton from "@core/ui/Button/PopupButton";
import ClipLoader from "react-spinners/ClipLoader";
import SavedSession from "@components/SavedSessions/SavedSessions";

function SavedSessionButton() {
  return (
    <PopupButton
      isDisabled={isLoading}
      buttonStyle={classes.add_exercises_button}
      triggerButtonContent={
        isLoading ? (
          <ClipLoader
            color={"#2694f9"}
            loading={isLoading}
            size={20}
            aria-label="Loading Spinner"
          />
        ) : exerciseIds?.length > 0 ? (
          "Update Exercises"
        ) : (
          "+ Add exercises"
        )
      }
      closebutton={"Close"}
      size="full"
      isTransparent={true}
      content={
        <ExerciseList
          exercises={exercises}
          addExercise={addExercise}
          removeExercise={removeExercise}
          exerciseIds={exerciseIds}
        />
      }
    />
  );
}

export default SavedSessionButton;
