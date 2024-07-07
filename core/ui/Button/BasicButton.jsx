"use client";

import React from "react";
import { Button } from "@nextui-org/react";

function BasicButton({
  buttonContent,
  buttonStyle,
  startContent,
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
    >
      {buttonContent}
    </Button>
  );
}

export default BasicButton;
