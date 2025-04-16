"use client";

import { useState } from "react";
import classes from "./stats.module.css";
import useStats from "@modules/client/requests/useStats";
import { Accordion, AccordionItem } from "@heroui/react";
import formatDate from "@modules/client/utils/formatDate";
import SelectField from "@core/ui/Fields/SelectField/SelectField";
import Skeleton from "@core/ui/Skeleton/Skeleton";
import GlobalStats from "@components/StatComponent/GlobalStats";
import ChartStats from "@components/StatComponent/ChartStats";
import FilterButton from "@core/ui/Button/FilterButton"

// Get all previous exercises stats by exercises id and uer id
function Stats() {
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
    setFilter,
    filter,
  } = useStats();
  const [accordionKey, setAccordionKey] = useState(new Set(["1"]));

  return (
    <div className={classes.data_container}>
      <div className={classes.header}>
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
      <FilterButton setFilter={setFilter} filter={filter} />
      </div>

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
                  <GlobalStats stat={latestStat} />
                  <ChartStats
                    stats={stats[exerciseName]}
                    getStatById={getStatById}
                    range={range}
                    startDate={startDate}
                  />
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
