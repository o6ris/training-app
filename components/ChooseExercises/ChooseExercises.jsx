"use client";

import { useRouter } from "next/navigation";
import classes from "./chooseExercises.module.css";
import SelectField from "@core/ui/Fields/SelectField/SelectField";
import ExerciseList from "@components/ExercisesList/ExerciseList";
import BasicButton from "@core/ui/Button/BasicButton";
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
}) {
  const router = useRouter();
  return (
    <div>
      {/* Choose muscles */}
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
        placeholder="eg: Chest, Legs, Arms, ..."
        ariaLabel="Choose muscles"
        variant="bordered"
        selectOnChange={(value) => setMuscleId(Array.from(value))}
        value={muscleId}
        disallowEmptySelection={true}
        hasImage={true}
      />
      {/* Choose Exercises */}
      {muscleId.length > 0 && (
        <ExerciseList
          exercises={exercises}
          addExercise={addExercise}
          removeExercise={removeExercise}
          selectedExercises={selectedExercises}
        />
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
