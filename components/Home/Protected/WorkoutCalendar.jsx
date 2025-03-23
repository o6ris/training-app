"use client";

import { useState, useEffect } from "react";
import useStats from "@modules/client/requests/useStats";
import classes from "./workoutCalendar.module.css";
import { Calendar } from "@heroui/react";
import { today, getLocalTimeZone } from "@internationalized/date";

function WorkoutCalendar() {
  const [value, setValue] = useState(today(getLocalTimeZone()));
  const [calendarWidth, setCalendarWidth] = useState(getInitialWidth());
  const { getStatsByDate, statsByDate } = useStats();

  const handleonChange = (value) => {
    getStatsByDate(value)
    setValue(value)
  }

  

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
    <Calendar
      aria-label="Date (Controlled)"
      value={value}
      onChange={handleonChange}
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
  );
}

export default WorkoutCalendar;
