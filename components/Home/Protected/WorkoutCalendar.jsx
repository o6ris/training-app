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
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

function WorkoutCalendar() {
  const { data: userSession, status } = useSession();
  const { userId } = useUser(userSession);
  const [selectedDay, setSelectedDay] = useState();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [calendarWidth, setCalendarWidth] = useState(getInitialWidth());
  const [isAutoOpen, setIsAutoOpen] = useState(false);
  const { getStatsByDate, statsByDate, workoutsDates, getWorkoutsDateByMonth  } = useStats(userId);


  const month = new Date(selectedMonth)
    .toISOString()
    .split("T")[0]
    .split("-")[1];

  const dayOnChange = (date) => {
    getStatsByDate(date);
    setSelectedDay(date);
  };

  useEffect(() => {
    if (userId) getWorkoutsDateByMonth(month);
  }, [userId, month]);

  const formattedWorkoutsDates = workoutsDates.map(dateStr => {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day); // Subtract 1 from month
  });

  const modifiers = {
    highlighted: (day) =>
      formattedWorkoutsDates.some((highlightedDate) =>
        isSameDay(highlightedDate, day)
      )
  };

  useEffect(() => {
    if (statsByDate.length > 0) setIsAutoOpen(true);
  }, [statsByDate]);

  function getInitialWidth() {
    return window.innerWidth < 512 ? "100" : "400px";
  }

  useEffect(() => {
    function handleResize() {
      setCalendarWidth(window.innerWidth < 600 ? "100" : "400px");
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
                    <GlobalStats stat={stat} />
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
            }
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
