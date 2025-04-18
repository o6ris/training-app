import classes from "./statsByExercises.module.css";
import PopupButton from "@core/ui/Button/PopupButton";
import VolumeDetails from "@components/VolumeDetails/VolumeDetails";

function StatsByExercises({ stat }) {
  const getMinutes = (seconds) => Math.floor(seconds / 60);
  const getSeconds = (seconds) => seconds % 60;

  return (
    <div className={classes.data_wrapper}>
      <div className={`${classes.data} ${classes.sets}`}>
        <p className={classes.data_value}>{stat?.sets.length}</p>
        <p className={classes.data_title}>Sets</p>
      </div>
      <div className={`${classes.data} ${classes.reps}`}>
        <p className={classes.data_value}>
          {" "}
          {stat?.sets.reduce((sum, current) => sum + current.reps, 0)}
        </p>
        <p className={classes.data_title}>Reps</p>
      </div>
      <div className={`${classes.data} ${classes.volume}`}>
        <PopupButton
          buttonStyle={classes.volume_button}
          closebutton="Close"
          triggerButtonContent={
            <>
              <p className={classes.data_value}>
                {(() => {
                  const value = stat?.sets.reduce(
                    (sum, current) =>
                      sum + (current.reps * current.weight),
                    0
                  );
                  return Number.isInteger(value)
                    ? value
                    : parseFloat(value.toFixed(1));
                })()}
              </p>
            </>
          }
          content={<VolumeDetails stat={stat} />}
          title="Volume details"
        />
        <p className={classes.data_title}>Volume(kg)</p>
      </div>
      <div className={`${classes.data} ${classes.rest_time}`}>
        <p className={classes.data_value}>{`${getMinutes(stat?.rest_time)
          .toString()
          .padStart(2, "0")}:${getSeconds(stat?.rest_time)
          .toString()
          .padStart(2, "0")}`}</p>
        <p className={classes.data_title}>Rest time</p>
      </div>
      <div className={`${classes.data} ${classes.training_time}`}>
        <p className={classes.data_value}>{`${getMinutes(stat?.training_time)
          .toString()
          .padStart(2, "0")}:${getSeconds(stat?.training_time)
          .toString()
          .padStart(2, "0")}`}</p>
        <p className={classes.data_title}>Training time</p>
      </div>
    </div>
  );
}

export default StatsByExercises;
