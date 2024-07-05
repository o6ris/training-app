"use client";

import { useState, useEffect, useContext } from "react";
import SessionContext from "@modules/client/contexts/sessionProvider";

function page() {
  const { session } = useContext(SessionContext)
  console.log("session", session)
  return (
    <div>page</div>
  )
}

export default page