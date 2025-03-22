"use client";
import { motion } from "framer-motion";
import classes from "./benefits.module.css";
import Icon from "@core/ui/Icons/Icon";
import framerMotion from "@modules/client/utils/framerMotion"

function Benefits() {
  const benefits = [
    {
      icon: "TrendingUp",
      title: "Progress is Motivation",
      text: "Seeing improvement keeps you going.",
    },
    {
      icon: "SearchCheck",
      title: "Avoid plateaus",
      text: "Identify when you stop progressing and adjust.",
    },
    {
      icon: "Lightbulb",
      title: "Train smarter, Not harder",
      text: "Optimize workouts based on your data.",
    },
    {
      icon: "ListChecks",
      title: "Stay accountable",
      text: "Keep history of your workouts forever.",
    },
  ];

  return (
    <section className={classes.benefits_wrapper}>
      <h2>Why track you Workouts?</h2>
      <div className={classes.benefits_content}>
        {benefits.map((benefit, i) => {
          return (
            <motion.article
              key={i}
              initial="hidden"
              whileInView="visible"
              variants={framerMotion.rightFadeInVariant}
              viewport={{ once: true, amount: 0.8 }}
            >
              <Icon
                name={benefit.icon}
                size={32}
                color="#EDF1FF"
                strokeWidth={2}
              />
              <h3>{benefit.title}</h3>
              <p>{benefit.text}</p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

export default Benefits;
