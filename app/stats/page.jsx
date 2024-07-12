"use client";

import { useState } from "react";
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

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  // console.log("stats", stats)
  return (
    <Accordion
      selectedKeys={accordionKey}
      onSelectionChange={setAccordionKey}
      variant="splitted"
      className={classes.accordion}
    >
      {Object.keys(stats).map((exerciseName, i) => {
        console.log("exerciseName", exerciseName);
        const key = (i + 1).toString();
        return (
          <AccordionItem
            key={key}
            title={
              <div>
                <div>
                  <h3>{`${exerciseName
                    .charAt(0)
                    .toUpperCase()}${exerciseName.slice(1)}`}</h3>
                    <span>{stats[exerciseName][0].date}</span>
                </div>
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
