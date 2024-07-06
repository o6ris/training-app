"use client";

import { useState, useEffect, useContext, useMemo } from "react";
import classes from "./session.module.css";
import SessionContext from "@modules/client/contexts/sessionProvider";
import { Accordion, AccordionItem } from "@nextui-org/react";
import SelectField from "@core/ui/Fields/SelectField/SelectField";
import SliderField from "@core/ui/Fields/SliderField/SliderField";

function page() {
  const { session, setSession, handleOnChangeSession, handleSetsOnChange } =
    useContext(SessionContext);
  const [accordionKey, setAccordionKey] = useState(new Set(["1"]));
  const [exercises, setExercises] = useState([]);

  const selectedAccordion = useMemo(
    () => Array.from(accordionKey).join(""),
    [accordionKey]
  );
  console.log("session", session);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const restTime = [
    { key: 30, value: "30 secondes" },
    { key: 45, value: "45 secondes" },
    { key: 60, value: "1 minute" },
    { key: 75, value: "1 minute 15 secondes" },
    { key: 90, value: "1 minute 30 secondes" },
    { key: 105, value: "1 minute 45 secondes" },
    { key: 120, value: "2 minutes" },
    { key: 135, value: "2 minutes 15 secondes" },
    { key: 150, value: "2 minutes 30 secondes" },
    { key: 165, value: "2 minutes 45 secondes" },
    { key: 180, value: "3 minutes" },
    { key: 195, value: "3 minutes 15 secondes" },
    { key: 210, value: "3 minutes 30 secondes" },
    { key: 225, value: "3 minutes 45 secondes" },
    { key: 240, value: "4 minutes" },
    { key: 255, value: "4 minutes 15 secondes" },
    { key: 270, value: "4 minutes 30 secondes" },
    { key: 285, value: "4 minutes 45 secondes" },
    { key: 300, value: "5 minutes" },
  ];

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

  useEffect(() => {
    const session = localStorage.getItem("session");
    if (session) {
      setSession(JSON.parse(session));
    }
  }, []);

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
                </div>
              }
              classNames={{ base: classes.accordion_item }}
            >
              <div className={classes.session_container}>
                {/* Choose rest time */}
                <SelectField
                  items={restTime}
                  label="Rest time"
                  placeholder="1 minutes"
                  labelPlacement="outside"
                  variant="bordered"
                  selectOnChange={(value) =>
                    handleOnChangeSession("restTime", Array.from(value), i)
                  }
                  value={exercise.restTime}
                  isMultiline={false}
                  classNames={{
                    // label: baseStyle.label,
                    value: classes.select_value,
                    trigger: classes.select_main_wrapper,
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
                    handleSetsOnChange("sets", value, i);
                  }}
                  classNames={{
                    track: classes.slider_track
                  }}
                />
              </div>
            </AccordionItem>
          );
        })}
      </Accordion>
    </>
  );
}

export default page;
