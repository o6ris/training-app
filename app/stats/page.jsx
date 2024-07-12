"use client";

import { useState } from "react";
import classes from "./stats.module.css";
import { useSession } from "next-auth/react";
import useUser from "@modules/client/userRequests/useUser";
import useStats from "@modules/client/userRequests/useStats";
import { Accordion, AccordionItem } from "@nextui-org/react";
import formatDate from "@modules/client/utils/formatDate";

// Get all previous exercises stats by exercises id and uer id
function Stats() {
  const { data: userSession, status } = useSession();
  const { userId } = useUser(userSession);
  const { stats } = useStats(userId);
  const [accordionKey, setAccordionKey] = useState(new Set(["1"]));

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const getMinutes = (seconds) => Math.floor(seconds / 60);
  const getSeconds = (seconds) => seconds % 60;
  // console.log("stats", stats)
  return (
    <Accordion
      selectedKeys={accordionKey}
      onSelectionChange={setAccordionKey}
      variant="splitted"
      className={classes.accordion}
    >
      {Object.keys(stats).map((exerciseName, i) => {
        // console.log("exercise", stats[exerciseName][0]);
        const key = (i + 1).toString();
        return (
          <AccordionItem
            key={key}
            title={
              <div className={classes.title_wrapper}>
                <h3>{exerciseName.toUpperCase()}</h3>
                <span>{formatDate(stats[exerciseName][0].date, false)}</span>
              </div>
            }
            classNames={{ base: classes.accordion_item }}
          >
            <div className={classes.session_container}>
              <div className={classes.data_wrapper}>
                <div className={`${classes.data} ${classes.sets}`}>
                  <p className={classes.data_value}>
                    {stats[exerciseName][0].sets.length}
                  </p>
                  <p className={classes.data_title}>Sets</p>
                </div>
                <div className={`${classes.data} ${classes.reps}`}>
                  <p className={classes.data_value}>
                    {" "}
                    {stats[exerciseName][0].sets.reduce(
                      (sum, current) => sum + current.reps,
                      0
                    )}
                  </p>
                  <p className={classes.data_title}>Reps</p>
                </div>
                <div className={`${classes.data} ${classes.rm}`}>
                  <p className={classes.data_value}>
                    {stats[exerciseName][0].sets.reduce(
                      (sum, current) => sum + current.reps*current.weight,
                      0
                    )} KG
                  </p>
                  <p className={classes.data_title}>Volume</p>
                </div>
                <div className={`${classes.data} ${classes.rest_time}`}>
                  <p className={classes.data_value}>{`${getMinutes(
                    stats[exerciseName][0].rest_time
                  )}:${getSeconds(stats[exerciseName][0].rest_time)}`}</p>
                  <p className={classes.data_title}>Rest time</p>
                </div>
                <div className={`${classes.data} ${classes.training_time}`}>
                  <p className={classes.data_value}>{`${getMinutes(
                    stats[exerciseName][0].training_time
                  )}:${getSeconds(stats[exerciseName][0].training_time)}`}</p>
                  <p className={classes.data_title}>Training time</p>
                </div>
              </div>
            </div>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

export default Stats;
