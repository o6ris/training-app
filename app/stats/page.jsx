"use client";

import { useState } from "react";
import classes from "./stats.module.css";
import useStats from "@modules/client/requests/useStats";
import { Accordion, AccordionItem } from "@heroui/react";
import formatDate from "@modules/client/utils/formatDate";
import SelectField from "@core/ui/Fields/SelectField/SelectField";
import Skeleton from "@core/ui/Skeleton/Skeleton";
import StatsByExercises from "@components/StatComponent/StatsByExercises";
import ChartStats from "@components/StatComponent/ChartStats";
import FilterButton from "@core/ui/Button/FilterButton";
import DonutChartStats from "@components/StatComponent/DonutChartStats";
import Icon from "@core/ui/Icons/Icon";

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
      {filter === "muscles" &&
        (isLoading ? (
          <Skeleton
            height={"12rem"}
            className={`${classes.data} ${classes.global_data}`}
          />
        ) : (
          <DonutChartStats stats={stats} />
        ))}
      {isLoading ? (
        <>
          <Skeleton
            height={"18rem"}
            className={`${classes.data} ${classes.global_data}`}
          />
          <Skeleton
            height={"4rem"}
            className={`${classes.data} ${classes.global_data}`}
          />
          <Skeleton
            height={"4rem"}
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
          {Object.keys(stats).map((name, i) => {
            const key = (i + 1).toString();
            const latestStat = latestStats[name];
            return (
              <AccordionItem
                key={key}
                textValue={name || "Exercise"}
                title={
                  <div className={classes.title_wrapper}>
                    <h3>{name.toUpperCase()}</h3>
                    {filter === "exercises" ? (
                      <span>{formatDate(latestStat?.date, false)}</span>
                    ) : (
                      <div className={classes.percentage_wrapper}>
                        <span
                          className={`${
                            parseFloat(stats[name]?.growth) > 0
                              ? classes.growth_up
                              : classes.growth_down
                          } `}
                        >
                          {stats[name]?.growth}
                        </span>
                        <div
                          className={`${
                            parseFloat(stats[name]?.growth) > 0
                              ? classes.growth_icon_up
                              : classes.growth_icon_down
                          } `}
                        >
                          <Icon
                            name={
                              parseFloat(stats[name]?.growth) > 0
                                ? "ChevronsUp"
                                : "ChevronsDown"
                            }
                            strokeWidth={2}
                            size={16}
                            color={
                              parseFloat(stats[name]?.growth) > 0
                                ? "#05ba8f"
                                : "#ba0505"
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                }
                classNames={{ base: classes.accordion_item }}
              >
                <div className={classes.section_wrapper}>
                  <ChartStats
                    stats={
                      filter === "exercises"
                        ? stats[name]
                        : stats[name].volumeByDate
                    }
                    getStatById={getStatById}
                    range={range}
                    startDate={startDate}
                    filter={filter}
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
