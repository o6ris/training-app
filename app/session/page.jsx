"use client";

import { useState, useEffect, useContext, useMemo } from "react";
import classes from "./session.module.css";
import SessionContext from "@modules/client/contexts/sessionProvider";
import { Accordion, AccordionItem } from "@nextui-org/react";

function page() {
  const { session, setSession } = useContext(SessionContext);
  const [accordionKey, setAccordionKey] = useState(new Set(["1"]));
  const [exercises, setExercises] = useState([]);

  const selectedAccordion = useMemo(
    () => Array.from(accordionKey).join(""),
    [accordionKey]
  );
  console.log("session", session);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

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
          console.log("exercise", exercise);
          const findExercise = exercises.find(
            (exo) => exo._id === exercise.exercise
          );
          console.log("find", findExercise?.name);
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
              <div></div>
            </AccordionItem>
          );
        })}
      </Accordion>
    </>
  );
}

export default page;
