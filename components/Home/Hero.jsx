"use client";

import { motion } from "framer-motion";
import classes from "./hero.module.css";
import ButtonLink from "@core/ui/Button/ButtonLink";
import framerMotion from "@modules/client/utils/framerMotion";

function Hero({ session }) {
  return (
    <section className={classes.hero_wrapper}>
      <article className={classes.hero_content}>
        <motion.h1
          initial="hidden"
          whileInView="visible"
          variants={framerMotion.rightFadeInVariant}
          viewport={{ once: true, amount: 0.2 }}
          className={classes.title}
        >
          <span>Track your Workouts.</span>
          <br />
          <span>See your Progress.</span>
          <br />
          <span>Stay Motivated.</span>
        </motion.h1>
        <motion.i
          initial="hidden"
          whileInView="visible"
          variants={framerMotion.leftFadeInVariant}
          viewport={{ once: true, amount: 0.2 }}
        >
          A simple and effective way to track your performance, and stay
          consistent with your fitness goals.
        </motion.i>
        <ButtonLink
          animated={true}
          url={session === null ? "/login" : "/workouts"}
          buttonContent={"Start Workout"}
          buttonStyle={classes.cta}
        />
      </article>
    </section>
  );
}

export default Hero;
