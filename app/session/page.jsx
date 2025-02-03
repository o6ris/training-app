"use client";

import { useState, useEffect, useContext, useTransition } from "react";
import { useRouter } from "next/navigation";
import classes from "./session.module.css";
import SessionContext from "@modules/client/contexts/sessionProvider";
import { Accordion, AccordionItem, Avatar, Image } from "@heroui/react";
import { Input } from "@heroui/react";
import useStopwatch from "@modules/client/utils/useStopwatch";
import useTimer from "@modules/client/utils/useTimer";
import SelectField from "@core/ui/Fields/SelectField/SelectField";
import SliderField from "@core/ui/Fields/SliderField/SliderField";
import BasicButton from "@core/ui/Button/BasicButton";
import InputField from "@core/ui/Fields/InputField/InputField";
import PopupButton from "@core/ui/Button/PopupButton";
import Icon from "@core/ui/Icons/Icon";
import { useSession } from "next-auth/react";
import useUser from "@modules/client/requests/useUser";
import useExercises from "@modules/client/requests/useExercises";
import Skeleton from "@core/ui/Skeleton/Skeleton";
import ClipLoader from "react-spinners/ClipLoader";

function Session() {
  const {
    session,
    setSession,
    handleOnChangeSession,
    handleAddSets,
    handleOnchangeSets,
    refreshExercise,
    exercisesId,
    setExercisesId,
  } = useContext(SessionContext);
  const { exercises, isLoading } = useExercises(exercisesId, "exercise");
  const [accordionKey, setAccordionKey] = useState(new Set(["1"]));
  const [isPending, startTransition] = useTransition();
  const { time, getSeconds, getMinutes, isRunning, start, pause, reset } =
    useStopwatch(false, session);
  const { startTimer, getFormattedTime, timers } = useTimer(session);
  const { data: userSession, status } = useSession();
  const { userId } = useUser(userSession);
  // console.log("time", time)

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const cloudinaryUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`;
  const router = useRouter();

  const restTime = [
    { key: 30, value: "30 seconds" },
    { key: 45, value: "45 seconds" },
    { key: 60, value: "1 minute" },
    { key: 75, value: "1 minute 15 seconds" },
    { key: 90, value: "1 minute 30 seconds" },
    { key: 105, value: "1 minute 45 seconds" },
    { key: 120, value: "2 minutes" },
    { key: 135, value: "2 minutes 15 seconds" },
    { key: 150, value: "2 minutes 30 seconds" },
    { key: 165, value: "2 minutes 45 seconds" },
    { key: 180, value: "3 minutes" },
    { key: 195, value: "3 minutes 15 seconds" },
    { key: 210, value: "3 minutes 30 seconds" },
    { key: 225, value: "3 minutes 45 seconds" },
    { key: 240, value: "4 minutes" },
    { key: 255, value: "4 minutes 15 seconds" },
    { key: 270, value: "4 minutes 30 seconds" },
    { key: 285, value: "4 minutes 45 seconds" },
    { key: 300, value: "5 minutes" },
  ];

  console.log("session", session);

  const saveExercise = async (i) => {
    try {
      const url = `${baseUrl}/api/stats`;
      delete session[i].isFinished;
      const response = await fetch(
        url,
        {
          method: "POST",
          body: JSON.stringify({
            ...session[i],
            rest_time: session[i].restTime,
            training_time: session[i].trainingTime,
            user: userId,
          }),
        },
        { next: { revalidate: 10 } }
      );
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    const session = localStorage.getItem("session");
    const exercisesId = localStorage.getItem("exercisesId");
    if (session && exercisesId) {
      setSession(JSON.parse(session));
      setExercisesId(JSON.parse(exercisesId));
    }
  }, []);

  return (
    <div className={classes.session_wrapper}>
      <Accordion
        selectedKeys={accordionKey}
        onSelectionChange={setAccordionKey}
        variant="splitted"
        className={classes.accordion}
      >
        {session.map((exercise, i) => {
          const findExercise = exercises.find(
            (exo) => exo._id === exercise?.exercise
          );
          const key = (i + 1).toString();
          return (
            <AccordionItem
              key={key}
              textValue={findExercise?.name || "Exercise"}
              title={
                <div>
                  <div className={classes.accordion_header}>
                    {isLoading ? (
                      <Skeleton width="40%" height="25px" />
                    ) : (
                      <h3>{`${findExercise?.name}`}</h3>
                    )}
                    <PopupButton
                      isIconOnly={true}
                      startContent={
                        <Icon
                          name="Info"
                          size={16}
                          color="white"
                          strokeWidth={3}
                        />
                      }
                      buttonStyle={classes.icon_button}
                      title={
                        <div className={classes.accordion_title}>
                          <PopupButton
                            isIconOnly={true}
                            startContent={
                              <Avatar
                                showFallback
                                className="w-24 h-24"
                                name={findExercise?.name}
                                src={`${cloudinaryUrl}${findExercise?.image}`}
                              />
                            }
                            buttonStyle={classes.image_button}
                            closebutton={"Close"}
                            content={
                              <Image
                                isZoomed
                                src={`${cloudinaryUrl}${findExercise?.image}`}
                                alt={findExercise?.name}
                                width={400}
                              />
                            }
                          />
                        </div>
                      }
                      closebutton={"Close"}
                      content={
                        <div className={classes.exercise_desc_content}>
                          <div>
                            <h3>Steps:</h3>
                            <p>{findExercise?.description.steps}</p>
                          </div>
                          <div>
                            <h3>Benefits:</h3>
                            <p>{findExercise?.description.benefits}</p>
                          </div>
                          <div>
                            <h3>Mistakes</h3>
                            <p>{findExercise?.description.mistakes}</p>
                          </div>
                        </div>
                      }
                    />
                  </div>
                </div>
              }
              classNames={{ base: classes.accordion_item }}
            >
              <div className={classes.session_container}>
                {/* Choose RM */}
                <InputField
                  label="1RM"
                  ariaLabel="One RM"
                  variant="bordered"
                  placeholder="Exemple: 100"
                  labelPlacement="outside"
                  isDisabled={exercise.isFinished}
                  value={exercise.rm}
                  onChange={(value) => handleOnChangeSession("rm", value, i)}
                  classNames={{
                    label: classes.label,
                    inputWrapper: classes.field_main_wrapper,
                    input: classes.field_value,
                  }}
                  endContent="Kg"
                />
                {/* Choose rest time */}
                <SelectField
                  items={restTime}
                  label="Rest time"
                  placeholder="1 minutes"
                  labelPlacement="outside"
                  variant="bordered"
                  isDisabled={exercise.isFinished}
                  selectOnChange={(value) =>
                    handleOnChangeSession(
                      "restTime",
                      Array.from(value).join(""),
                      i
                    )
                  }
                  value={exercise.restTime}
                  isMultiline={false}
                  classNames={{
                    // label: baseStyle.label,
                    value: classes.field_value,
                    trigger: classes.field_main_wrapper,
                    popoverContent: classes.select_listbox_container,
                    listbox: classes.select_listbox,
                  }}
                />
                {/* Choose number of sets */}
                <SliderField
                  label="Choose sets number"
                  color="secondary"
                  value={exercise.sets.length}
                  onChange={(value) => {
                    handleAddSets("sets", value, i);
                  }}
                  classNames={{
                    track: classes.slider_track,
                  }}
                  isDisabled={exercise.isFinished}
                />
                {/* Choose reps and weight */}
                <div className={classes.sets_container}>
                  {exercise.sets.map((set, index) => {
                    const timer = timers[i]?.[index];
                    return (
                      <div key={index} className={classes.set_container}>
                        <Input
                          aria-label="repetions"
                          variant="bordered"
                          value={set.reps}
                          endContent="reps"
                          type="number"
                          onValueChange={(value) =>
                            handleOnchangeSets("reps", value, i, index)
                          }
                          isDisabled={exercise.isFinished}
                        />
                        <Input
                          aria-label="repetions"
                          variant="bordered"
                          value={set.weight}
                          endContent="kg"
                          type="number"
                          onValueChange={(value) =>
                            handleOnchangeSets("weight", value, i, index)
                          }
                          isDisabled={exercise.isFinished}
                        />
                        <BasicButton
                          onAction={() => startTimer(i, index)}
                          buttonContent={
                            timer?.isRunning
                              ? getFormattedTime(timer.seconds)
                              : "DONE"
                          }
                          isDisabled={
                            (timer?.isRunning === false &&
                              timer?.seconds === 0) ||
                            exercise.isFinished
                          }
                          buttonStyle={classes.timer_button}
                        />
                      </div>
                    );
                  })}
                </div>
                {/* stopwatch buttons */}
                <div className={classes.stopwatch_buttons}>
                  <BasicButton
                    onAction={() => {
                      if (isRunning[i]) {
                        pause(i);
                      } else {
                        start(i);
                      }
                    }}
                    buttonContent={
                      <div>
                        {time[0] === 0 && time[1] === 0 ? (
                          "Start"
                        ) : (
                          <>
                            <span>
                              {getMinutes(i).toString().padStart(2, "0")}
                            </span>
                            :
                            <span>
                              {getSeconds(i).toString().padStart(2, "0")}
                            </span>
                          </>
                        )}
                      </div>
                    }
                    startContent={
                      isRunning[i] ? (
                        <Icon
                          name="Pause"
                          size={16}
                          color="white"
                          strokeWidth={3}
                        />
                      ) : (
                        <Icon
                          name="Play"
                          size={16}
                          color="white"
                          strokeWidth={3}
                        />
                      )
                    }
                    buttonStyle={`${classes.button} ${classes.start_button}`}
                    isDisabled={exercise.isFinished}
                  />
                  <PopupButton
                    triggerAction={() => {
                      pause(i);
                    }}
                    triggerButtonContent="Save"
                    startContent={
                      <Icon
                        name="Check"
                        size={16}
                        color="white"
                        strokeWidth={3}
                      />
                    }
                    onCancel={() => start(i)}
                    onConfirm={() => {
                      handleOnChangeSession("trainingTime", time[i], i);
                      saveExercise(i);
                      handleOnChangeSession("isFinished", true, i);
                    }}
                    buttonStyle={`${classes.button} ${classes.finish_button}`}
                    title="Are you sure you want to end this exercise?"
                    content="Once confirmed, this exercise will be marked as complete permanently, with no option to change the data."
                    isDisabled={exercise.isFinished}
                  />
                  <PopupButton
                    triggerAction={() => {
                      pause(i);
                      handleOnChangeSession("trainingTime", time[i], i);
                    }}
                    triggerButtonContent={
                      <Icon name="RefreshCcw" size={16} color="white" />
                    }
                    onCancel={() => start(i)}
                    onConfirm={() => {
                      reset(i);
                      refreshExercise(i);
                    }}
                    buttonStyle={`${classes.button} ${classes.reset_button}`}
                    isIconOnly={true}
                    title="Are you sure you want to reset this exercise?"
                    content="Confirming will erase all progress and restart this exercise from zero."
                    isDisabled={exercise.isFinished}
                  />
                </div>
              </div>
            </AccordionItem>
          );
        })}
      </Accordion>
      <PopupButton
        triggerAction={undefined}
        triggerButtonContent={
          isPending ? (
            <ClipLoader
              color={"#EDF1FF"}
              loading={isPending}
              size={20}
              aria-label="Loading Spinner"
            />
          ) : (
            "End Session"
          )
        }
        isDisabled={isPending ? true : false}
        onCancel={undefined}
        onConfirm={() => {
          startTransition(() => {
            router.push("/stats");
            localStorage.removeItem("session");
          });
        }}
        buttonStyle={`${classes.button}`}
        title="Are you sure you want to end this session?"
        content="Make sure you've saved all exercises before ending your session to prevent any unsaved progress."
      />
    </div>
  );
}

export default Session;
