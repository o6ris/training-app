"use client";

import { useState, useContext, useTransition } from "react";
import classes from "./createSession.module.css";
import useExercises from "@modules/client/requests/useExercises";
import SessionContext from "@modules/client/contexts/sessionProvider";
import useWorkoutSession from "@modules/client/requests/useWorkoutSession";
import { useSession } from "next-auth/react";
import SelectField from "@core/ui/Fields/SelectField/SelectField";
import ExerciseList from "@components/ExercisesList/ExerciseList";
import ButtonLink from "@core/ui/Button/ButtonLink";
import DeleteButton from "@components/DeleteButton/DeleteButton";
import PopupButton from "@core/ui/Button/PopupButton";
import InputField from "@core/ui/Fields/InputField/InputField";
import { Accordion, AccordionItem, Avatar, Image } from "@heroui/react";
import ClipLoader from "react-spinners/ClipLoader";
import Icon from "@core/ui/Icons/Icon";

function CreateSession({ muscles }) {
  const { data: session } = useSession();
  const { createSession } = useContext(SessionContext);
  const [muscleId, setMusculeId] = useState([]);
  const [sessionName, setSessionName] = useState("");
  const [isPending, startTransition] = useTransition();
  const {
    exerciseIds,
    latestExercises,
    exercises,
    isLoading,
    addExercise,
    removeExercise,
  } = useExercises(muscleId, "muscle");
  const { saveSession } = useWorkoutSession();
  const cloudinaryUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`;

  const selectedExercises = exercises.filter((exercise) => {
    return exerciseIds.includes(exercise._id);
  });

  return (
    <>
      <div className={classes.session_container}>
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
          labelPlacement="outside"
          variant="bordered"
          selectOnChange={(value) => setMusculeId(Array.from(value))}
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
            exerciseIds={exerciseIds}
          />
        )}
      </div>
      {exerciseIds.length > 0 && (
        <div className={classes.footer_button}>
          <PopupButton
            disableConfirm={sessionName.length < 2}
            triggerButtonContent="Save session"
            buttonStyle={classes.save_session_button}
            startContent={
              <Icon name="Save" size={16} color="#2694f9" strokeWidth={2} />
            }
            title="Save your session"
            content={
              <div className={classes.save_session_modal}>
                <p className={classes.save_session_info}>
                  Next time you train, you won&nbsp;t have to select all your
                  exercises again, your session will be ready to go
                </p>
                <InputField
                  value={sessionName}
                  onChange={(value) => setSessionName(value)}
                  labelPlacement="outside"
                  label="Session name"
                  labelStyle={classes.session_name_label}
                />
              </div>
            }
            onConfirm={() =>
              saveSession(session.user.email, sessionName, exerciseIds)
            }
            confirmButton="Save"
          />
          <ButtonLink
            url={"/session"}
            onAction={() =>
              startTransition(() => {
                createSession(exerciseIds, latestExercises);
              })
            }
            buttonContent={
              isPending ? (
                <ClipLoader
                  color={"#EDF1FF"}
                  loading={isPending}
                  size={20}
                  aria-label="Loading Spinner"
                />
              ) : (
                "Start session"
              )
            }
            buttonStyle={classes.add_session_button}
          />
        </div>
      )}
    </>
  );
}

export default CreateSession;
