"use client";

import { useState, useEffect } from "react";
import useStats from "@modules/client/requests/useStats";
import classes from "./workoutCalendar.module.css";
import { Calendar, Accordion, AccordionItem } from "@heroui/react";
import { today, getLocalTimeZone } from "@internationalized/date";
import PopupButton from "@core/ui/Button/PopupButton";
import GlobalStats from "@components/StatComponent/GlobalStats";

function WorkoutCalendar() {
  const [value, setValue] = useState();
  const [calendarWidth, setCalendarWidth] = useState(getInitialWidth());
  const [isAutoOpen, setIsAutoOpen] = useState(false);
  const { getStatsByDate, statsByDate } = useStats();

  const handleonChange = (value) => {
    getStatsByDate(value);
    setValue(value);
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
          setValue(null);
          setIsAutoOpen(false);
        }}
        title={`${value?.year}-${value?.month}-${value?.day}`}
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
      <Calendar
        aria-label="Date (Controlled)"
        value={value}
        onChange={handleonChange}
        onFocusChange={(value) => console.log(value)}
        maxValue={today(getLocalTimeZone())}
        calendarWidth={calendarWidth}
        classNames={{
          base: classes.calendar_wrapper,
          headerWrapper: classes.calendar_header,
          title: classes.calendar_title,
          gridHeaderRow: classes.calendar_header_row,
          gridHeaderCell: classes.calendar_header_cells,
          prevButton: classes.calendar_prev_button,
          nextButton: classes.calendar_next_button,
          content: classes.calendar_content,
          gridBodyRow: classes.calendar_body_row,
        }}
      />
    </>
  );
}

export default WorkoutCalendar;
