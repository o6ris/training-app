import classes from "./ctaButton.module.css";
import { useSession } from "next-auth/react";
import useUser from "@modules/client/requests/useUser";
import useStopwatch from "@modules/client/utils/useStopwatch";
import PopupButton from "@core/ui/Button/PopupButton";
import Icon from "@core/ui/Icons/Icon";

function SaveButton({ handleOnChangeSession, session, i, exercise }) {
  const { data: userSession } = useSession();
  const { userId } = useUser(userSession);
  const { time, start, pause } = useStopwatch(false, session);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const saveExercise = async (i) => {
    try {
      const url = `${baseUrl}/api/stats`;
      delete session[i].isFinished;
      const response = await fetch(
        url,
        {
          method: "POST",
          body: JSON.stringify({
            ...session[i],
            rest_time: session[i].restTime,
            training_time: session[i].trainingTime,
            user: userId,
          }),
        },
        { next: { revalidate: 10 } }
      );
    } catch (error) {
      throw error;
    }
  };

  return (
    <PopupButton
      triggerAction={() => {
        pause(i);
      }}
      triggerButtonContent="Save exercise"
      startContent={
        <Icon name="Save" size={16} color="white" strokeWidth={2} />
      }
      onCancel={() => start(i)}
      onConfirm={() => {
        handleOnChangeSession("trainingTime", time[i], i);
        saveExercise(i);
        handleOnChangeSession("isFinished", true, i);
      }}
      buttonStyle={`${classes.button} ${classes.save_button}`}
      title="Are you sure you want to end this exercise?"
      content="Once confirmed, this exercise will be marked as complete permanently, with no option to change the data."
      isDisabled={exercise.isFinished}
      confirmButton="Save"
      confirmButtonStyle={classes.save_button}
    />
  );
}

export default SaveButton;
