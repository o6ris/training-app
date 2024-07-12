"use client";

import { useState, useEffect } from "react";
import classes from "./stats.module.css";
import { useSession } from "next-auth/react";
import useUser from "@modules/client/userRequests/useUser";
import useStats from "@modules/client/userRequests/useStats";
import { Accordion, AccordionItem } from "@nextui-org/react";

// Get all previous exercises stats by exercises id and uer id
function Stats() {
  const { data: userSession, status } = useSession();
  const { userId } = useUser(userSession);
  const { stats } = useStats(userId);
  const [accordionKey, setAccordionKey] = useState(new Set(["1"]));
  const [exercises, setExercises] = useState([]);

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
    getExercises();
  }, []);

  // console.log("stats", stats)
  return (
    <Accordion
      selectedKeys={accordionKey}
      onSelectionChange={setAccordionKey}
      variant="splitted"
      className={classes.accordion}
    >
      {stats.map((exercise, i) => {
        // console.log("exercise", Object.keys(exercise).join(""));
        const findExercise = exercises.find(
          (exo) => exo.name === Object.keys(exercise).join("")
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
                {/* <span>{getMinutes(i).toString().padStart(2, "0")}</span>:
                <span>{getSeconds(i).toString().padStart(2, "0")}</span> */}
              </div>
            }
            classNames={{ base: classes.accordion_item }}
          >
            <div className={classes.session_container}></div>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

export default Stats;
