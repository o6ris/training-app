import classes from "./ctaButton.module.css";
import PopupButton from "@core/ui/Button/PopupButton";
import Icon from "@core/ui/Icons/Icon";
import useStopwatch from "@modules/client/utils/useStopwatch";

function ResetButton({
  handleOnChangeSession,
  i,
  exercise,
  resetExercise,
  time,
  start,
  pause,
  reset,
}) {
  return (
    <PopupButton
      triggerAction={() => {
        pause(i);
        handleOnChangeSession("trainingTime", time[i], i);
      }}
      triggerButtonContent={<Icon name="RefreshCcw" size={16} color="white" />}
      onCancel={() => start(i)}
      onConfirm={() => {
        reset(i);
        resetExercise(i);
      }}
      buttonStyle={`${classes.button} ${classes.reset_button}`}
      isIconOnly={true}
      title="Are you sure you want to reset this exercise?"
      content="Confirming will erase all progress and restart this exercise from zero."
      isDisabled={exercise.isFinished}
      confirmButton="Reset"
      confirmButtonStyle={classes.reset_button}
    />
  );
}

export default ResetButton;
