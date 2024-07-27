"use client";

import { useState } from "react";
import classes from "./stats.module.css";
import { useSession } from "next-auth/react";
import useUser from "@modules/client/userRequests/useUser";
import useStats from "@modules/client/userRequests/useStats";
import { Accordion, AccordionItem } from "@nextui-org/react";
import formatDate from "@modules/client/utils/formatDate";
import LineChart from "@core/ui/Chart/LineChart";
import SelectField from "@core/ui/Fields/SelectField/SelectField";

// Get all previous exercises stats by exercises id and uer id
function Stats() {
  const { data: userSession, status } = useSession();
  const { userId } = useUser(userSession);
  const { stats, latestStats, getStatById, range, setRange } =
    useStats(userId);
  const [accordionKey, setAccordionKey] = useState(new Set(["1"]));

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
        const key = (i + 1).toString();
        const latestStat = latestStats[exerciseName];
        return (
          <AccordionItem
            key={key}
            title={
              <div className={classes.title_wrapper}>
                <h3>{exerciseName.toUpperCase()}</h3>
                <span>{formatDate(latestStat?.date, false)}</span>
              </div>
            }
            classNames={{ base: classes.accordion_item }}
          >
            <div className={classes.exercise_wrapper}>
              <div className={classes.data_wrapper}>
                <div className={`${classes.data} ${classes.sets}`}>
                  <p className={classes.data_value}>
                    {latestStat?.sets.length}
                  </p>
                  <p className={classes.data_title}>Sets</p>
                </div>
                <div className={`${classes.data} ${classes.reps}`}>
                  <p className={classes.data_value}>
                    {" "}
                    {latestStat?.sets.reduce(
                      (sum, current) => sum + current.reps,
                      0
                    )}
                  </p>
                  <p className={classes.data_title}>Reps</p>
                </div>
                <div className={`${classes.data} ${classes.rm}`}>
                  <p className={classes.data_value}>
                    {latestStat?.sets.reduce(
                      (sum, current) => sum + current.reps * current.weight,
                      0
                    )}{" "}
                    KG
                  </p>
                  <p className={classes.data_title}>Volume</p>
                </div>
                <div className={`${classes.data} ${classes.rest_time}`}>
                  <p className={classes.data_value}>{`${getMinutes(
                    latestStat?.rest_time
                  )
                    .toString()
                    .padStart(2, "0")}:${getSeconds(latestStat?.rest_time)
                    .toString()
                    .padStart(2, "0")}`}</p>
                  <p className={classes.data_title}>Rest time</p>
                </div>
                <div className={`${classes.data} ${classes.training_time}`}>
                  <p className={classes.data_value}>{`${getMinutes(
                    latestStat?.training_time
                  )
                    .toString()
                    .padStart(2, "0")}:${getSeconds(latestStat?.training_time)
                    .toString()
                    .padStart(2, "0")}`}</p>
                  <p className={classes.data_title}>Training time</p>
                </div>
              </div>
              <div className={classes.chart_wrapper}>
                <div className={classes.chart_header}>
                  <h3>Volume (T)</h3>
                  <div>
                    <SelectField
                      items={[
                        {
                          key: "month",
                          value: "Current month",
                        },
                        {
                          key: "trim",
                          value: "Last 3 months",
                        },
                        {
                          key: "sem",
                          value: "Last 6 months",
                        },
                        {
                          key: "year",
                          value: "Last 12 months",
                        },
                      ]}
                      variant="bordered"
                      ariaLabel="Range"
                      labelPlacement="outside"
                      selectOnChange={(value) => {
                        console.log(value);
                        return setRange(Array.from(value).join(""));
                      }}
                      value={range}
                      disallowEmptySelection={true}
                    />
                  </div>
                </div>
                <LineChart
                  stats={stats[exerciseName]}
                  getStatById={getStatById}
                  range={range}
                />
              </div>
            </div>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

export default Stats;
