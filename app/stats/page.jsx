"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import useUser from "@modules/client/userRequests/useUser";

// Get all previous exercises stats by exercises id and uer id
function Stats() {
  const { data: userSession, status } = useSession();
  const { userId } = useUser(userSession);

  
}

export default Stats;
