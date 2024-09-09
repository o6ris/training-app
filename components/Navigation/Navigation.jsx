import classes from "./navigation.module.css";
import Icon from "@core/ui/Icons/Icon";
import Link from "next/link";

function Navigation() {
  return (
    <nav className={classes.nav}>
      <Link className={classes.link} href="/createSession">
        <Icon name="Dumbbell" size={16} color="#02091C" strokeWidth={2} />
        <span>Workout</span>
      </Link>
      <Link className={classes.link} href="/stats">
        <Icon name="TrendingUp" size={16} color="#02091C" strokeWidth={2} />
        <span>Stats</span>
      </Link>
      <Link className={classes.link} href="/profil">
        <Icon name="User" size={16} color="#02091C" strokeWidth={2} />
        <span>Profil</span>
      </Link>
    </nav>
  );
}

export default Navigation;
