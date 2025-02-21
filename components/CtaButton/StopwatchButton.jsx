import classes from "./ctaButton.module.css";
import BasicButton from "@core/ui/Button/BasicButton";
import Icon from "@core/ui/Icons/Icon";
import useStopwatch from "@modules/client/utils/useStopwatch";

function StopwatchButton({ session, i, exercise }) {
  const { time, getSeconds, getMinutes, isRunning, start, pause, reset } =
    useStopwatch(false, session);

  return (
    <BasicButton
      onAction={() => {
        if (isRunning[i]) {
          pause(i);
        } else {
          start(i);
        }
      }}
      buttonContent={
        <div>
          {time[0] === 0 && time[1] === 0 ? (
            "Start"
          ) : (
            <>
              <span>{getMinutes(i).toString().padStart(2, "0")}</span>:
              <span>{getSeconds(i).toString().padStart(2, "0")}</span>
            </>
          )}
        </div>
      }
      startContent={
        isRunning[i] ? (
          <Icon name="Pause" size={16} color="white" strokeWidth={3} />
        ) : (
          <Icon name="Play" size={16} color="white" strokeWidth={3} />
        )
      }
      buttonStyle={`${classes.button} ${classes.start_button}`}
      isDisabled={exercise.isFinished}
    />
  );
}

export default StopwatchButton;
