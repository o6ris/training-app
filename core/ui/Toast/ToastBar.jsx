"useClient";

import { useContext } from "react";
import classes from "./toast.module.css";
import Icon from "../Icons/Icon";
import NotificationContext from "@modules/client/contexts/toastNotificationProvider";

function ToastBar() {
  const { notification, handleNotification, isSuccess } =
    useContext(NotificationContext);

  if (!notification) {
    return null;
  }

  return (
    <div
      className={isSuccess ? classes.container_success : classes.container_fail}
    >
      <div className={classes.text_container}>
        {isSuccess ? (
          <Icon name="Check" strokeWidth={2} color="#edf1ff" />
        ) : (
          <Icon name="TriangleAlert" strokeWidth={2} color={"#edf1ff"} />
        )}
        <p>{notification}</p>
      </div>
      <button
        onClick={() => handleNotification(null)}
        className={classes.close_icon}
      >
        <Icon
          name="Plus"
          style={{ transform: "rotate(45deg)" }}
          size={16}
          strokeWidth={2}
          color={"#edf1ff"}
        />
      </button>
    </div>
  );
}

export default ToastBar;
