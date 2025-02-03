"use client";

import React from "react";
import { Button } from "@heroui/react";

function BasicButton({
  buttonContent,
  buttonStyle,
  startContent,
  endContent,
  onAction,
  isIconOnly,
  isDisabled,
}) {
  return (
    <Button
      onClick={onAction}
      className={buttonStyle}
      startContent={startContent}
      isIconOnly={isIconOnly}
      isDisabled={isDisabled}
      endContent={endContent}
    >
      {buttonContent}
    </Button>
  );
}

export default BasicButton;
