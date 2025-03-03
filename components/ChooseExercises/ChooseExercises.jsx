"use client";

import { useState, useEffect } from "react";
import classes from "./chooseExercises.module.css";
import SelectField from "@core/ui/Fields/SelectField/SelectField";
import InputField from "@core/ui/Fields/InputField/InputField";
import ExerciseList from "@components/ExercisesList/ExerciseList";
import BasicButton from "@core/ui/Button/BasicButton";
import Skeleton from "@core/ui/Skeleton/Skeleton";
import Icon from "@core/ui/Icons/Icon";

function ChooseExercises({
  muscleId,
  setMuscleId,
  exercises,
  addExercise,
  removeExercise,
  selectedExercises,
  muscles,
  setDisplayAddExercise,
  isLoading,
}) {
  const [filteredExercises, setFilteredExercises] = useState(exercises);

  const debounce = (onChange) => {
    let timeout;
    return (value) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        onChange(value);
      }, 500);
    };
  };
  const handleSearch = (value) => {
    const filteredExercises = exercises.filter((exercise) =>
      exercise.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredExercises([...filteredExercises]);
  };

  useEffect(() => {
    if (exercises.length > 0) setFilteredExercises(exercises);
  }, [exercises]);

  return (
    <div className={classes.main_wrapper}>
      {/* Choose muscles */}
      <div className={classes.header}>
        <InputField
          variant="bordered"
          classNames={{
            input: classes.field_value,
            inputWrapper: classes.field_wrapper,
          }}
          startContent={<Icon name="Search" strokeWidth={2} size={16} />}
          isClearable={true}
          placeholder="Search..."
          onChange={debounce((value) => {
            handleSearch(value);
          })}
        />
        <SelectField
          items={[
            ...(muscles?.map((muscle) => ({
              key: muscle._id,
              value: `${muscle.name.charAt(0).toUpperCase()}${muscle.name.slice(
                1
              )}`,
              image: muscle.image,
            })) || []),
            { key: "all", value: "All muscles" },
          ]}
          classNames={{
            value: classes.field_value,
            trigger: classes.field_wrapper,
          }}
          placeholder="eg: Chest, Legs, Arms, ..."
          ariaLabel="Choose muscles"
          variant="bordered"
          selectOnChange={(value) => setMuscleId(Array.from(value))}
          value={muscleId.length > 0 ? muscleId : "all"}
          disallowEmptySelection={true}
          hasImage={true}
        />
      </div>
      {/* Choose Exercises */}
      {muscleId.length > 0 && !isLoading ? (
        <ExerciseList
          exercises={filteredExercises}
          addExercise={addExercise}
          removeExercise={removeExercise}
          selectedExercises={selectedExercises}
        />
      ) : (
        <>
          {Array.from({ length: 15 }).map((_, index) => (
            <Skeleton key={index} height="2rem" width="100%" />
          ))}
        </>
      )}
      <div className={classes.footer_button}>
        <BasicButton
          buttonContent="Cancel"
          buttonStyle={classes.cancel_button}
          onAction={() => setDisplayAddExercise(false)}
        />
        <BasicButton
          isDisabled={selectedExercises.length === 0}
          buttonContent={`Add (${selectedExercises.length})`}
          buttonStyle={classes.save_session_button}
          startContent={
            <Icon name="Plus" size={16} color="#edf1ff" strokeWidth={2} />
          }
          onAction={() => setDisplayAddExercise(false)}
        />
      </div>
    </div>
  );
}

export default ChooseExercises;
