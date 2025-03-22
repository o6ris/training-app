"use client";

import classes from "./navigation.module.css";
import Icon from "@core/ui/Icons/Icon";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Navigation() {
  const pathname = usePathname();

  const hiddenRoutes = ["/workouts/create-session"];
  if (hiddenRoutes.includes(pathname)) {
    return null;
  }
  return (
    <nav className={classes.nav}>
      <Link className={classes.link} href="/home">
        <Icon
          name="House"
          size={16}
          color={pathname === "/home" ? "#2694F9" : "#02091C"}
          strokeWidth={pathname === "/home" ? 3 : 2}
        />
        <span className={pathname === "/home" ? classes.active_link : ""}>
          Home
        </span>
      </Link>
      <Link className={classes.link} href="/workouts">
        <Icon
          name="Dumbbell"
          size={16}
          color={pathname === "/workouts" ? "#2694F9" : "#02091C"}
          strokeWidth={pathname === "/workouts" ? 3 : 2}
        />
        <span className={pathname === "/workouts" ? classes.active_link : ""}>
          Workouts
        </span>
      </Link>
      <Link className={classes.link} href="/stats">
        <Icon
          name="TrendingUp"
          size={16}
          color={pathname === "/stats" ? "#2694F9" : "#02091C"}
          strokeWidth={pathname === "/stats" ? 3 : 2}
        />
        <span className={pathname === "/stats" ? classes.active_link : ""}>
          Stats
        </span>
      </Link>
      <Link className={classes.link} href="/profile">
        <Icon
          name="User"
          size={16}
          color={pathname === "/profile" ? "#2694F9" : "#02091C"}
          strokeWidth={pathname === "/profile" ? 3 : 2}
        />
        <span className={pathname === "/profile" ? classes.active_link : ""}>
          Profil
        </span>
      </Link>
    </nav>
  );
}

export default Navigation;
