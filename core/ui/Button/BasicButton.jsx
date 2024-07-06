"use client";

import React from "react";
import { Button } from "@nextui-org/react";

function BasicButton({
  buttonContent,
  buttonStyle,
  startContent,
  onAction,
  isIconOnly,
}) {
  return (
    <Button
      onClick={onAction}
      className={buttonStyle}
      startContent={startContent}
      isIconOnly={isIconOnly}
    >
      {buttonContent}
    </Button>
  );
}

export default BasicButton;
