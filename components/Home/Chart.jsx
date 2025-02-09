"use client";

import { useState } from "react";
import classes from "./chart.module.css";
import { motion } from "framer-motion";
import framerMotion from "@modules/client/utils/framerMotion";
import stats from "@modules/client/utils/statsMockdata";
import SelectField from "@core/ui/Fields/SelectField/SelectField";
import LineChart from "@core/ui/Chart/LineChart";

function Chart() {
  const [range, setRange] = useState("month");
  const [startDate, setStartDate] = useState("");

  const renderStartDate = () => {
    const now = new Date(2025, 1, 9);
    switch (range) {
      case "month":
        setStartDate(new Date(now.setDate(now.getDate() - 30)));
        break;
      case "trim":
        setStartDate(new Date(now.setMonth(now.getMonth() - 3)));
        break;
      case "sem":
        setStartDate(new Date(now.setMonth(now.getMonth() - 6)));
        break;
      case "year":
        setStartDate(new Date(now.setMonth(now.getMonth() - 12)));
        break;
      default:
        setStartDate(new Date(0));
    }
  };

  return (
    <section className={classes.chart_wrapper}>
      <h2>Elevate your Workout Journey!</h2>
      <motion.p
        initial="hidden"
        whileInView="visible"
        variants={framerMotion.bottomFadeInVariant}
        viewport={{ once: true, amount: 0.8 }}
      >
        Take your fitness to the next level with our easy-to-use{" "}
        <strong>workout tracking app</strong>.
      </motion.p>
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
      <LineChart
        stats={stats}
        range={range}
        customEndDate={"2025-02-28"}
      />
      <motion.p>
        Monitor your <strong>progress</strong>, set <strong>goals</strong>, and
        stay motivated with personalized <strong>workout insights</strong> and
        real-time <strong>data</strong>. Achieve better results by optimizing
        your <strong>training routine</strong> and tracking every{" "}
        <strong>rep</strong>, <strong>set</strong>, and <strong>lift</strong>.
      </motion.p>
    </section>
  );
}

export default Chart;
