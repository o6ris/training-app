"use client";

import { useState, useEffect } from "react";
import useUser from "@modules/client/requests/useUser";
import { useSession } from "next-auth/react";
import useStats from "@modules/client/requests/useStats";
import classes from "./workoutCalendar.module.css";
import { Accordion, AccordionItem } from "@heroui/react";
import { isSameDay } from "date-fns";
import PopupButton from "@core/ui/Button/PopupButton";
import GlobalStats from "@components/StatComponent/GlobalStats";
import ChartStats from "@components/StatComponent/ChartStats";
import ButtonLink from "@core/ui/Button/ButtonLink";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

function WorkoutCalendar() {
  const { data: userSession } = useSession();
  const { userId } = useUser(userSession);
  const [selectedDay, setSelectedDay] = useState();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [isAutoOpen, setIsAutoOpen] = useState(false);
  const {
    getStatsByDate,
    statsByDate,
    stats,
    workoutsDates,
    getStatsByMonth,
    getStatById,
    startDate,
    firstDateOfMonth,
    isLoading,
  } = useStats(userId);

  console.log("workoutsDates", workoutsDates);
  console.log("stats", stats);

  const month = new Date(selectedMonth)
    .toISOString()
    .split("T")[0]
    .split("-")[1];

  const dayOnChange = (date) => {
    getStatsByDate(date);
    setSelectedDay(date);
  };

  useEffect(() => {
    if (userId) getStatsByMonth(month);
  }, [userId, month]);

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
                      <GlobalStats stat={stat} />
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
    </>
  );
}

export default WorkoutCalendar;
