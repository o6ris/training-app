"use client"

import React from 'react'
import { Button } from "@nextui-org/react"

function BasicButton({
  buttonContent,
  buttonStyle,
  startContent,
  onAction,
}) {
  return (
    <Button onClick={() => onAction()} className={buttonStyle} startContent={startContent}>
      {buttonContent}
    </Button>
  )
}

export default BasicButton