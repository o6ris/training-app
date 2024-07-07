"use client";

import { useState, useEffect, useContext, useMemo } from "react";
import classes from "./session.module.css";
import SessionContext from "@modules/client/contexts/sessionProvider";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import useStopwatch from "@modules/client/utils/useStopwatch";
import useTimer from "@modules/client/utils/useTimer";
import SelectField from "@core/ui/Fields/SelectField/SelectField";
import SliderField from "@core/ui/Fields/SliderField/SliderField";
import BasicButton from "@core/ui/Button/BasicButton";
import InputField from "@core/ui/Fields/InputField/InputField";
import PopupButton from "@core/ui/Button/PopupButton";
import Icon from "@core/ui/Icons/Icon";
import { useSession } from "next-auth/react";

function page() {
  const {
    session,
    setSession,
    handleOnChangeSession,
    handleAddSets,
    handleOnchangeSets,
  } = useContext(SessionContext);
  const [accordionKey, setAccordionKey] = useState(new Set(["1"]));
  const [exercises, setExercises] = useState([]);
  const [userId, setUserId] = useState("");
  const { time, getSeconds, getMinutes, isRunning, start, pause, reset } =
    useStopwatch(false, session.length);
  const { startTimer, getFormattedTime, timers } = useTimer(session);
  const { data: userSession, status } = useSession();

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  console.log("session", session);

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

  const getUser = async () => {
    try {
      const url = `${baseUrl}/api/users?email=${userSession?.user.email}`;
      const response = await fetch(
        url,
        { method: "GET" },
        { next: { revalidate: 10 } }
      );
      if (response) {
        const user = await response.json();
        setUserId(user._id);
      }
    } catch (error) {
      throw error;
    }
  };

  const getExercises = async () => {
    try {
      const url = `${baseUrl}/api/exercises`;
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

  const saveExercise = async (i) => {
    try {
      const url = `${baseUrl}/api/stats`;
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
    if (session) {
      setSession(JSON.parse(session));
    }
  }, []);

  useEffect(() => {
    getUser();
  }, [userSession]);

  useEffect(() => {
    getExercises();
  }, []);

  return (
    <>
      <Accordion
        selectedKeys={accordionKey}
        onSelectionChange={setAccordionKey}
        variant="splitted"
      >
        {session.map((exercise, i) => {
          const findExercise = exercises.find(
            (exo) => exo._id === exercise.exercise
          );
          const key = (i + 1).toString();
          return (
            <AccordionItem
              key={key}
              title={
                <div>
                  <h3>{`${findExercise?.name
                    .charAt(0)
                    .toUpperCase()}${findExercise?.name.slice(1)}`}</h3>
                  <span>{getMinutes(i).toString().padStart(2, "0")}</span>:
                  <span>{getSeconds(i).toString().padStart(2, "0")}</span>
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
                  selectOnChange={(value) =>
                    handleOnChangeSession(
                      "restTime",
                      parseInt(Array.from(value).join("")),
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
                />
                {/* Choose reps and weight */}
                <div className={classes.sets_container}>
                  {exercise.sets.map((set, index) => {
                    const timer = timers[i]?.[index];
                    return (
                      <div className={classes.set_container}>
                        <Input
                          aria-label="repetions"
                          variant="bordered"
                          value={set.reps}
                          endContent="reps"
                          type="number"
                          onValueChange={(value) =>
                            handleOnchangeSets("reps", value, i, index)
                          }
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
                        />
                        <BasicButton
                          onAction={() => startTimer(i, index)}
                          buttonContent={
                            timer?.isRunning
                              ? getFormattedTime(timer.seconds)
                              : "DONE"
                          }
                          isDisabled={
                            timer?.isRunning === false && timer?.seconds === 0
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
                    onAction={() => (isRunning[i] ? pause(i) : start(i))}
                    buttonContent={isRunning[i] ? "Pause" : "Start"}
                    buttonStyle={`${classes.stopwatch_button} ${classes.start_button}`}
                  />
                  <PopupButton
                    triggerAction={() => {
                      pause(i);
                      handleOnChangeSession("trainingTime", time[i], i);
                    }}
                    triggerButtonContent="Finish"
                    onCancel={() => start(i)}
                    onConfirm={() => saveExercise(i)}
                    buttonStyle={`${classes.stopwatch_button} ${classes.finish_button}`}
                    title="Are you sure you want to end this exercise?"
                    content="Once confirmed, this exercise will be marked as complete permanently, with no option to change the data."
                  />
                  <BasicButton
                    onAction={() => reset(i)}
                    buttonContent={
                      <Icon name="RefreshCcw" size={16} color="white" />
                    }
                    buttonStyle={`${classes.stopwatch_button} ${classes.reset_button}`}
                    isIconOnly={true}
                  />
                </div>
              </div>
            </AccordionItem>
          );
        })}
      </Accordion>
    </>
  );
}

export default page;
