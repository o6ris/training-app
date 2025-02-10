"use client";

import Link from "next/link";
import classes from "./button.module.css";
import { motion } from "framer-motion";
import framerMotion from "@modules/client/utils/framerMotion";

function ButtonLink({ url, buttonContent, buttonStyle, onAction, animated }) {
  return animated ? (
    <motion.div
      className={`${classes.button} ${buttonStyle}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial="hidden"
      whileInView="visible"
      variants={framerMotion.bottomFadeInVariant}
      viewport={{ once: true, amount: 0.2 }}
    >
      <Link onClick={() => onAction()} href={url}>
        {buttonContent}
      </Link>
    </motion.div>
  ) : (
    <Link
      onClick={() => onAction()}
      className={`${classes.button} ${buttonStyle}`}
      href={url}
    >
      {buttonContent}
    </Link>
  );
}

export default ButtonLink;
