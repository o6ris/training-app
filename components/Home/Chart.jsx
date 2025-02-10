"use client";

import { useState, useEffect } from "react";
import classes from "./chart.module.css";
import { motion } from "framer-motion";
import framerMotion from "@modules/client/utils/framerMotion";
import stats from "@modules/client/utils/statsMockdata";
import SelectField from "@core/ui/Fields/SelectField/SelectField";
import LineChart from "@core/ui/Chart/LineChart";
import formatDate from "@modules/client/utils/formatDate";
import ButtonLink from "@core/ui/Button/ButtonLink";

function Chart({ session }) {
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

  useEffect(() => {
    renderStartDate();
  }, [range]);

  return (
    <section className={classes.chart_wrapper}>
      <h2>Elevate your Workout Journey!</h2>
      <motion.p
        initial="hidden"
        whileInView="visible"
        variants={framerMotion.bottomFadeInVariant}
        viewport={{ once: true, amount: 0.5 }}
      >
        Visualize your <strong>progress</strong> over time with interactive{" "}
        <strong>charts</strong> that track your{" "}
        <strong>volume (rep, sets and weight) by exercises</strong>.
      </motion.p>
      <motion.div
        style={{ width: "100%" }}
        initial="hidden"
        whileInView="visible"
        variants={framerMotion.bottomFadeInVariant}
        viewport={{ once: true, amount: 0.5 }}
      >
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
      </motion.div>
      <motion.div
        className={classes.lineChart}
        initial="hidden"
        whileInView="visible"
        variants={framerMotion.bottomFadeInVariant}
        viewport={{ once: true, amount: 0.3 }}
      >
        <h3>Volume (T)</h3>
        <p className={classes.chart_subtitle}>
          {formatDate(startDate, false)} -{" "}
          {formatDate(new Date("2025-02-25"), false)}
        </p>
        <LineChart stats={stats} range={range} customEndDate={"2025-02-28"} />
      </motion.div>
      <p>
        Turn <strong>data</strong> into motivation and{" "}
        <strong>push your limits</strong> every session!
      </p>
      <ButtonLink
        animated={true}
        url={session === null ? "/login" : "/createSession"}
        buttonContent={"Get Started"}
        buttonStyle={classes.cta}
      />
    </section>
  );
}

export default Chart;
