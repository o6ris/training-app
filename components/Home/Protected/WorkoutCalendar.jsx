"use client";

import { useState, useEffect, useMemo } from "react";
import useUser from "@modules/client/requests/useUser";
import { useSession } from "next-auth/react";
import useStats from "@modules/client/requests/useStats";
import classes from "./workoutCalendar.module.css";
import { Accordion, AccordionItem } from "@heroui/react";
import { isSameDay } from "date-fns";
import PopupButton from "@core/ui/Button/PopupButton";
import StatsByExercises from "@components/StatComponent/StatsByExercises";
import ChartStats from "@components/StatComponent/ChartStats";
import ButtonLink from "@core/ui/Button/ButtonLink";
import { DayPicker } from "react-day-picker";
import Skeleton from "@core/ui/Skeleton/Skeleton";
import "react-day-picker/style.css";

function WorkoutCalendar({ session }) {
  const { userId } = useUser(session);
  const [selectedDay, setSelectedDay] = useState();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [isAutoOpen, setIsAutoOpen] = useState(false);
  const month = new Date(selectedMonth)
    .toISOString()
    .split("T")[0]
    .split("-")[1];
  const {
    getStatsByDate,
    statsByDate,
    stats,
    workoutsDates,
    getStatsByMonth,
    getStatById,
    firstDateOfMonth,
    isLoading,
  } = useStats(month);

  const totalVolume = useMemo(() => {
    let volume = 0;
    Object.values(stats).forEach((exerciseArray) => {
      exerciseArray.forEach((exercise) => {
        exercise.sets.forEach((set) => {
          volume += set.reps * set.weight;
        });
      });
    });
    return Math.floor(volume);
  }, [stats]);
  const formattedVolume = new Intl.NumberFormat("fr-FR").format(totalVolume);

  const dayOnChange = (date) => {
    getStatsByDate(date);
    setSelectedDay(date);
  };

  const formattedWorkoutsDates = workoutsDates.map((dateStr) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day); // Subtract 1 from month
  });

  const modifiers = {
    highlighted: (day) =>
      formattedWorkoutsDates.some((highlightedDate) =>
        isSameDay(highlightedDate, day)
      ),
  };

  useEffect(() => {
    if (statsByDate.length > 0) setIsAutoOpen(true);
  }, [statsByDate]);

  return (
    <>
      <PopupButton
        autoOpen={isAutoOpen}
        onCancel={() => {
          setSelectedDay(null);
          setIsAutoOpen(false);
        }}
        title={selectedDay && new Date(selectedDay).toISOString().split("T")[0]}
        size="full"
        content={
          <Accordion variant="splitted" className={classes.accordion}>
            {statsByDate?.length > 0 &&
              statsByDate.map((stat, i) => {
                return (
                  <AccordionItem
                    key={i}
                    textValue={stat.exercise.name || "Exercise"}
                    title={<h3>{stat.exercise.name.toUpperCase()}</h3>}
                    classNames={{ base: classes.accordion_item }}
                  >
                    <div className={classes.stats_wrapper}>
                      <StatsByExercises stat={stat} />
                      <ChartStats
                        stats={stats[stat.exercise.name]}
                        getStatById={getStatById}
                        range={"month"}
                        startDate={firstDateOfMonth(selectedDay)}
                        customStartDate={firstDateOfMonth(selectedDay)}
                      />
                      <ButtonLink
                        url={`/stats?id=${stat.exercise._id}`}
                        buttonContent="See all stats"
                        buttonStyle={classes.see_stats_button}
                      />
                    </div>
                  </AccordionItem>
                );
              })}
          </Accordion>
        }
      />
      <div className={classes.wrapper}>
        <div className={classes.data_wrapper}>
          <div className={classes.data}>
            <p className={classes.data_value}>{workoutsDates?.length}</p>
            <p className={classes.data_title}>Workouts</p>
          </div>
          <div className={classes.data}>
            <p className={classes.data_value}>{formattedVolume}</p>
            <p className={classes.data_title}>Total volume (kg)</p>
          </div>
        </div>
        {isLoading ? (
          <div className={classes.skeleton_container}>
            <div className={classes.skeleton_header}>
              <Skeleton
                style={{ marginBottom: "10px" }}
                height={"25px"}
                width={"100px"}
                classDefault={false}
                className={classes.skeleton}
              />
              <div className={classes.skeleton_chevron}>
                <Skeleton
                  style={{ marginBottom: "10px" }}
                  height={"25px"}
                  width={"50px"}
                  classDefault={false}
                  className={classes.skeleton}
                />
                <Skeleton
                  style={{ marginBottom: "10px" }}
                  height={"25px"}
                  width={"50px"}
                  classDefault={false}
                  className={classes.skeleton}
                />
              </div>
            </div>
            <div className={classes.skeleton_grid}>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                (day, index) => (
                  <span key={index} className={classes.skeleton_day}>
                    {day}
                  </span>
                )
              )}
            </div>
            <div style={{ height: "15rem" }} className={classes.skeleton_grid}>
              {Array.from({ length: 25 }).map((_, index) => (
                <Skeleton
                  key={index}
                  height={"25px"}
                  width={"25px"}
                  classDefault={false}
                  className={classes.skeleton}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className={classes.calendar_container}>
            <DayPicker
              modifiers={modifiers}
              classNames={{
                months: classes.months,
                month_grid: classes.month_grid,
                day: classes.day,
                today: classes.today,
                chevron: classes.chevron,
              }}
              modifiersStyles={{
                highlighted: {
                  color: "#2694f9",
                  fontWeight: "bolder",
                },
              }}
              animate
              mode="single"
              month={selectedMonth}
              onMonthChange={setSelectedMonth}
              selected={selectedDay}
              onSelect={dayOnChange}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default WorkoutCalendar;
