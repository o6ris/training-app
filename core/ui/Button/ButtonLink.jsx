"use client";

import React from "react";
import Link from "next/link";
import classes from "./button.module.css";

function ButtonLink({ url, buttonContent, buttonStyle, onAction }) {
  return (
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
