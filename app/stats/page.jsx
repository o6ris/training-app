"use client";

import { useState } from "react";
import classes from "./stats.module.css";
import { useSession } from "next-auth/react";
import useUser from "@modules/client/requests/useUser";
import useStats from "@modules/client/requests/useStats";
import { Accordion, AccordionItem } from "@heroui/react";
import formatDate from "@modules/client/utils/formatDate";
import LineChart from "@core/ui/Chart/LineChart";
import SelectField from "@core/ui/Fields/SelectField/SelectField";
import PopupButton from "@core/ui/Button/PopupButton";
import VolumeDetails from "@components/VolumeDetails/VolumeDetails";
import Skeleton from "@core/ui/Skeleton/Skeleton";

// Get all previous exercises stats by exercises id and uer id
function Stats() {
  const { data: userSession, status } = useSession();
  const { userId } = useUser(userSession);
  const {
    stats,
    workoutDateslist,
    allExerciseList,
    latestStats,
    getStatById,
    range,
    setRange,
    startDate,
    isLoading,
  } = useStats(userId);
  const [accordionKey, setAccordionKey] = useState(new Set(["1"]));

  const getMinutes = (seconds) => Math.floor(seconds / 60);
  const getSeconds = (seconds) => seconds % 60;

  return (
    <div className={classes.data_container}>
      <SelectField
        items={[
          {
            key: "month",
            value: "Last month",
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
          return setRange(Array.from(value).join(""));
        }}
        value={range}
        disallowEmptySelection={true}
      />

      <div className={classes.global_data_wrapper}>
        {isLoading ? (
          <Skeleton
            height={"4rem"}
            className={`${classes.data} ${classes.global_data}`}
          />
        ) : (
          <div className={`${classes.data} ${classes.global_data}`}>
            <p className={classes.data_value}>{workoutDateslist.length}</p>
            <p className={classes.data_title}>Total Workouts</p>
          </div>
        )}
        {isLoading ? (
          <Skeleton
            height={"4rem"}
            className={`${classes.data} ${classes.global_data}`}
          />
        ) : (
          <div className={`${classes.data} ${classes.global_data}`}>
            <p className={classes.data_value}> {allExerciseList.length}</p>
            <p className={classes.data_title}>Total Exercises</p>
          </div>
        )}
      </div>
      {isLoading ? (
        <>
          <Skeleton
            height={"12rem"}
            className={`${classes.data} ${classes.global_data}`}
          />
          <Skeleton
            height={"1rem"}
            className={`${classes.data} ${classes.global_data}`}
          />
          <Skeleton
            height={"1rem"}
            className={`${classes.data} ${classes.global_data}`}
          />
        </>
      ) : (
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
                textValue={exerciseName || "Exercise"}
                title={
                  <div className={classes.title_wrapper}>
                    <h3>{exerciseName.toUpperCase()}</h3>
                    <span>{formatDate(latestStat?.date, false)}</span>
                  </div>
                }
                classNames={{ base: classes.accordion_item }}
              >
                <div className={classes.section_wrapper}>
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
                    <div className={`${classes.data} ${classes.volume}`}>
                      <PopupButton
                        buttonStyle={classes.volume_button}
                        closebutton="Close"
                        triggerButtonContent={
                          <>
                            <p className={classes.data_value}>
                              {latestStat?.sets.reduce(
                                (sum, current) =>
                                  sum + (current.reps * current.weight) / 1000,
                                0
                              )}{" "}
                            </p>
                          </>
                        }
                        content={<VolumeDetails stat={latestStat} />}
                        title="Volume details"
                      />
                      <p className={classes.data_title}>Volume(T)</p>
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
                        .padStart(2, "0")}:${getSeconds(
                        latestStat?.training_time
                      )
                        .toString()
                        .padStart(2, "0")}`}</p>
                      <p className={classes.data_title}>Training time</p>
                    </div>
                  </div>
                  <div className={classes.chart_wrapper}>
                    <div>
                      <h3>Volume (T)</h3>
                      <p className={classes.chart_subti}>
                        {formatDate(startDate, false)} -{" "}
                        {formatDate(new Date(), false)}
                      </p>
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
      )}
    </div>
  );
}

export default Stats;
