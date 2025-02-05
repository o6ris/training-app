"use client";

import { useState, useEffect, useContext, useTransition } from "react";
import { useRouter } from "next/navigation";
import classes from "./session.module.css";
import SessionContext from "@modules/client/contexts/sessionProvider";
import { Accordion, AccordionItem, Avatar, Image } from "@heroui/react";
import { Input } from "@heroui/react";
import useStopwatch from "@modules/client/utils/useStopwatch";
import useTimer from "@modules/client/utils/useTimer";
import InputField from "@core/ui/Fields/InputField/InputField";
import BasicButton from "@core/ui/Button/BasicButton";
import PopupButton from "@core/ui/Button/PopupButton";
import Icon from "@core/ui/Icons/Icon";
import { useSession } from "next-auth/react";
import useUser from "@modules/client/requests/useUser";
import useExercises from "@modules/client/requests/useExercises";
import Skeleton from "@core/ui/Skeleton/Skeleton";
import ClipLoader from "react-spinners/ClipLoader";

function Session() {
  const {
    session,
    setSession,
    handleOnChangeSession,
    handleAddSets,
    handleOnchangeSets,
    refreshExercise,
    exercisesId,
    setExercisesId,
  } = useContext(SessionContext);
  const { exercises, isLoading } = useExercises(exercisesId, "exercise");
  const [accordionKey, setAccordionKey] = useState(new Set(["1"]));
  const [isPending, startTransition] = useTransition();
  const { time, getSeconds, getMinutes, isRunning, start, pause, reset } =
    useStopwatch(false, session);
  const { startTimer, getFormattedTime, timers, resetTimers } =
    useTimer(session);
  const { data: userSession, status } = useSession();
  const { userId } = useUser(userSession);
  // console.log("time", timers);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const cloudinaryUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`;
  const router = useRouter();

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

  useEffect(() => {
    const session = localStorage.getItem("session");
    const exercisesId = localStorage.getItem("exercisesId");
    if (session && exercisesId) {
      setSession(JSON.parse(session));
      setExercisesId(JSON.parse(exercisesId));
    }
  }, []);

  return (
    <div className={classes.session_wrapper}>
      <Accordion
        selectedKeys={accordionKey}
        onSelectionChange={setAccordionKey}
        variant="splitted"
        className={classes.accordion}
      >
        {session.map((exercise, i) => {
          const findExercise = exercises.find(
            (exo) => exo._id === exercise?.exercise
          );
          const key = (i + 1).toString();
          return (
            <AccordionItem
              key={key}
              textValue={findExercise?.name || "Exercise"}
              title={
                <div>
                  <div className={classes.accordion_header}>
                    {isLoading ? (
                      <Skeleton width="40%" height="25px" />
                    ) : (
                      <h3>{`${findExercise?.name}`}</h3>
                    )}
                    <PopupButton
                      isIconOnly={true}
                      startContent={
                        <Icon
                          name="Info"
                          size={16}
                          color="white"
                          strokeWidth={3}
                        />
                      }
                      buttonStyle={classes.icon_button}
                      title={
                        <div className={classes.accordion_title}>
                          <PopupButton
                            isIconOnly={true}
                            startContent={
                              <Avatar
                                showFallback
                                className="w-24 h-24"
                                name={findExercise?.name}
                                src={`${cloudinaryUrl}${findExercise?.image}`}
                              />
                            }
                            buttonStyle={classes.image_button}
                            closebutton={"Close"}
                            content={
                              <Image
                                isZoomed
                                src={`${cloudinaryUrl}${findExercise?.image}`}
                                alt={findExercise?.name}
                                width={400}
                              />
                            }
                          />
                        </div>
                      }
                      closebutton={"Close"}
                      content={
                        <div className={classes.exercise_desc_content}>
                          <div>
                            <h3>Steps:</h3>
                            <p>{findExercise?.description.steps}</p>
                          </div>
                          <div>
                            <h3>Benefits:</h3>
                            <p>{findExercise?.description.benefits}</p>
                          </div>
                          <div>
                            <h3>Mistakes</h3>
                            <p>{findExercise?.description.mistakes}</p>
                          </div>
                        </div>
                      }
                    />
                  </div>
                </div>
              }
              classNames={{ base: classes.accordion_item }}
            >
              <div className={classes.session_container}>
                <div className={classes.stopwatch_buttons}>
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
                            <span>
                              {getMinutes(i).toString().padStart(2, "0")}
                            </span>
                            :
                            <span>
                              {getSeconds(i).toString().padStart(2, "0")}
                            </span>
                          </>
                        )}
                      </div>
                    }
                    startContent={
                      isRunning[i] ? (
                        <Icon
                          name="Pause"
                          size={16}
                          color="white"
                          strokeWidth={3}
                        />
                      ) : (
                        <Icon
                          name="Play"
                          size={16}
                          color="white"
                          strokeWidth={3}
                        />
                      )
                    }
                    buttonStyle={`${classes.button} ${classes.start_button}`}
                    isDisabled={exercise.isFinished}
                  />
                  <PopupButton
                    triggerAction={() => {
                      pause(i);
                    }}
                    triggerButtonContent="Save"
                    startContent={
                      <Icon
                        name="Check"
                        size={16}
                        color="white"
                        strokeWidth={3}
                      />
                    }
                    onCancel={() => start(i)}
                    onConfirm={() => {
                      handleOnChangeSession("trainingTime", time[i], i);
                      saveExercise(i);
                      handleOnChangeSession("isFinished", true, i);
                    }}
                    buttonStyle={`${classes.button} ${classes.finish_button}`}
                    title="Are you sure you want to end this exercise?"
                    content="Once confirmed, this exercise will be marked as complete permanently, with no option to change the data."
                    isDisabled={exercise.isFinished}
                  />
                  <PopupButton
                    triggerAction={() => {
                      pause(i);
                      handleOnChangeSession("trainingTime", time[i], i);
                    }}
                    triggerButtonContent={
                      <Icon name="RefreshCcw" size={16} color="white" />
                    }
                    onCancel={() => start(i)}
                    onConfirm={() => {
                      reset(i);
                      refreshExercise(i);
                    }}
                    buttonStyle={`${classes.button} ${classes.reset_button}`}
                    isIconOnly={true}
                    title="Are you sure you want to reset this exercise?"
                    content="Confirming will erase all progress and restart this exercise from zero."
                    isDisabled={exercise.isFinished}
                  />
                </div>
                {/* Choose rest time */}
                <div className={classes.session_first_section}>
                  <InputField
                    label={
                      <div className={classes.label_with_info}>
                        <span>Rest time (sec)</span>
                        <PopupButton
                          isIconOnly={true}
                          startContent={
                            <Icon
                              name="Info"
                              size={16}
                              color="white"
                              strokeWidth={2}
                            />
                          }
                          buttonStyle={classes.input_info}
                          title={"Why should you take rest between sets?"}
                          closebutton={"Close"}
                          content={
                            <div className={classes.modal_content}>
                              <p>
                                Rest time is crucial for maximizing your
                                performance and recovery during workouts. The
                                amount of rest you need will{" "}
                                <strong>
                                  depend on the weight you lift, the number of
                                  sets, and the number of reps you perform
                                </strong>
                                .
                              </p>
                              <div>
                                <h3>How Long Should You Rest?</h3>
                                <ul>
                                  <li>
                                    - Strength (1-5 reps, heavy weight):{" "}
                                    <strong>3 to 5 min.</strong> This duration
                                    allows for optimal recovery of the
                                    phosphagen system, essential for maximal
                                    strength output.
                                  </li>
                                  <li>
                                    - Muscle Growth (6-12 reps, moderate
                                    weight): <strong>1 to 3 min.</strong>{" "}
                                    Shorter rest intervals can increase
                                    metabolic stress, which is beneficial for
                                    muscle growth.
                                  </li>
                                  <li>
                                    - Endurance (12+ reps, lighter weight):{" "}
                                    <strong>30 to 60 sec.</strong> This promotes
                                    endurance by challenging your muscles to
                                    perform under fatigue.
                                  </li>
                                </ul>
                              </div>
                              <p>
                                Choose your rest wisely based on your goal to
                                get the best results!
                              </p>
                            </div>
                          }
                        />
                      </div>
                    }
                    variant="bordered"
                    placeholder="60"
                    labelPlacement="outside"
                    value={exercise?.restTime || 60}
                    onChange={(value) =>
                      handleOnChangeSession("restTime", value, i)
                    }
                    isDisabled={exercise.isFinished}
                    classNames={{
                      label: classes.label,
                      inputWrapper: classes.field_main_wrapper,
                      input: classes.field_value,
                    }}
                    min={1}
                    max={600}
                    type="number"
                  />
                  {/* Choose number of sets */}
                  <InputField
                    label={
                      <div className={classes.label_with_info}>
                        <span>Sets</span>
                        <PopupButton
                          isIconOnly={true}
                          startContent={
                            <Icon
                              name="Info"
                              size={16}
                              color="white"
                              strokeWidth={2}
                            />
                          }
                          buttonStyle={classes.input_info}
                          title={"How Many Sets Should You Do?"}
                          closebutton={"Close"}
                          content={
                            <div className={classes.modal_content}>
                              <p>
                                The number of sets you perform directly impacts
                                your results. The ideal number of sets will
                                depend on the weight you lift, the number of
                                reps, and your training goal.
                              </p>
                              <div>
                                <h3>How to Choose the Right Number of Sets?</h3>
                                <ul>
                                  <li>
                                    - Strength (1-5 reps, heavy weight):{" "}
                                    <strong>3 to 6 sets.</strong> This range
                                    effectively builds strength by providing
                                    sufficient volume
                                  </li>
                                  <li>
                                    - Muscle Growth (6-12 reps, moderate
                                    weight): <strong>3 to 5 sets.</strong> This
                                    volume has been shown to optimize muscle
                                    growth.
                                  </li>
                                  <li>
                                    - Endurance (12+ reps, lighter weight):{" "}
                                    <strong>2 to 4 sets.</strong> This approach
                                    enhances endurance without leading to
                                    excessive fatigue
                                  </li>
                                </ul>
                              </div>
                              <p>
                                Choose your rest wisely based on your goal to
                                get the best results!
                              </p>
                            </div>
                          }
                        />
                      </div>
                    }
                    variant="bordered"
                    placeholder="1"
                    labelPlacement="outside"
                    value={exercise?.sets.length}
                    onChange={(value) => {
                      handleAddSets("sets", value, i);
                    }}
                    isDisabled={exercise.isFinished}
                    classNames={{
                      label: classes.label,
                      inputWrapper: classes.field_main_wrapper,
                      input: classes.field_value,
                    }}
                    min={1}
                    max={9}
                    type="number"
                  />
                </div>
                {/* Choose reps and weight */}
                <div className={classes.sets_container}>
                  {exercise.sets.map((set, index) => {
                    const timer = timers[i]?.[index];
                    return (
                      <div key={index} className={classes.set_container}>
                        <InputField
                          aria-label="repetions"
                          label={
                            <div className={classes.label_with_info}>
                              <span>Reps</span>
                              <PopupButton
                                isIconOnly={true}
                                startContent={
                                  <Icon
                                    name="Info"
                                    size={16}
                                    color="white"
                                    strokeWidth={2}
                                  />
                                }
                                buttonStyle={classes.input_info}
                                title={"How Many Reps Should You Do?"}
                                closebutton={"Close"}
                                content={
                                  <div className={classes.modal_content}>
                                    <p>
                                      The number of reps you perform determines
                                      the type of gains you'll achieve. The
                                      ideal rep range depends on the weight you
                                      lift, the number of sets, and your rest
                                      time.
                                    </p>
                                    <div>
                                      <h3>
                                        How to Choose the Right Number of Reps?
                                      </h3>
                                      <ul>
                                        <li>
                                          - Strength (Heavy weight, long rest,
                                          low sets):{" "}
                                          <strong>1 to 5 reps.</strong>{" "}
                                          Maximizes force production and
                                          neuromuscular efficiency.
                                        </li>
                                        <li>
                                          - Muscle Growth (Moderate weight,
                                          moderate rest, moderate sets):{" "}
                                          <strong>6 to 12 reps.</strong> Best
                                          for hypertrophy, balancing tension and
                                          volume.
                                        </li>
                                        <li>
                                          - Endurance (Light weight, short rest,
                                          lower sets):{" "}
                                          <strong>12+ reps.</strong> Enhances
                                          muscular endurance and stamina.
                                        </li>
                                      </ul>
                                    </div>
                                    <p>
                                    By adjusting your reps based on weight, sets, and rest time, you&rsquo;ll optimize your training for better results and progression!
                                    </p>
                                  </div>
                                }
                              />
                            </div>
                          }
                          variant="bordered"
                          value={set.reps}
                          type="number"
                          onChange={(value) =>
                            handleOnchangeSets("reps", value, i, index)
                          }
                          classNames={{
                            label: classes.label,
                            inputWrapper: classes.field_main_wrapper,
                            input: classes.field_value,
                          }}
                          isDisabled={exercise.isFinished}
                        />
                        <InputField
                          aria-label="repetions"
                          label={
                            <div className={classes.label_with_info}>
                              <span>Weight (kg)</span>
                              <PopupButton
                                isIconOnly={true}
                                startContent={
                                  <Icon
                                    name="Info"
                                    size={16}
                                    color="white"
                                    strokeWidth={2}
                                  />
                                }
                                buttonStyle={classes.input_info}
                                title={"How to choose the right Weight?"}
                                closebutton={"Close"}
                                content={
                                  <div className={classes.modal_content}>
                                    <p>
                                      The weight you lift directly impacts your
                                      strength, muscle growth, and endurance.
                                      Choosing the right weight depends on the
                                      number of reps, sets, and your rest time
                                      to match your training goal.
                                    </p>
                                    <div>
                                      <h3>How to select the right Weight?</h3>
                                      <ul>
                                        <li>
                                          - Strength (1-5 reps, long rest, low
                                          sets):{" "}
                                          <strong>
                                            Heavy weight (85-100% of 1RM).{" "}
                                          </strong>
                                          Focuses on maximum force production,
                                          with fewer reps and longer rest
                                          periods.
                                        </li>
                                        <li>
                                          - Muscle Growth (6-12 reps, moderate
                                          rest, moderate sets):{" "}
                                          <strong>
                                            Moderate weight (65-85% of 1RM).{" "}
                                          </strong>
                                          Optimal for hypertrophy, balancing
                                          muscle tension and volume.
                                        </li>
                                        <li>
                                          - Endurance (12+ reps, short rest,
                                          lower sets):{" "}
                                          <strong>
                                            Light weight (50-65% of 1RM).{" "}
                                          </strong>
                                          Improves muscular endurance with high
                                          reps and minimal rest.
                                        </li>
                                      </ul>
                                    </div>
                                    <div>
                                      <h3>
                                        How to know if your weight is correct?
                                      </h3>
                                      <ul>
                                        <li>
                                          - If you can&rsquo;t complete your reps with
                                          proper form, reduce the weight.
                                        </li>
                                        <li>
                                          - If you can do more reps than planned
                                          easily, increase the weight.
                                        </li>
                                        <li>
                                          - Your last reps should feel
                                          challenging but manageable without
                                          losing form.
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                }
                              />
                            </div>
                          }
                          variant="bordered"
                          value={set.weight}
                          type="number"
                          onChange={(value) =>
                            handleOnchangeSets("weight", value, i, index)
                          }
                          classNames={{
                            label: classes.label,
                            inputWrapper: classes.field_main_wrapper,
                            input: classes.field_value,
                          }}
                          isDisabled={exercise.isFinished}
                        />
                        <PopupButton
                          triggerAction={() =>
                            !timer?.isRunning && resetTimers()
                          }
                          triggerButtonContent={
                            timer?.isRunning
                              ? getFormattedTime(timer.seconds)
                              : "Start rest time"
                          }
                          buttonStyle={classes.timer_button}
                          closebutton={"Close"}
                          isDisabled={
                            (!timer?.isRunning && timer?.seconds === 0) ||
                            exercise.isFinished ||
                            (timers.some((exerciseTimers) =>
                              exerciseTimers.some(
                                (setTimer) => setTimer.isRunning
                              )
                            ) &&
                              !timer?.isRunning)
                          }
                          content={
                            <BasicButton
                              onAction={() => startTimer(i, index)}
                              buttonContent={
                                timer?.isRunning ? (
                                  getFormattedTime(timer.seconds)
                                ) : (
                                  <>
                                    <Icon
                                      name="Play"
                                      size={16}
                                      color="#2694F9"
                                      strokeWidth={3}
                                    />
                                    {getFormattedTime(timer?.seconds)}
                                  </>
                                )
                              }
                              isDisabled={
                                (timer?.isRunning === false &&
                                  timer?.seconds === 0) ||
                                exercise.isFinished
                              }
                              buttonStyle={classes.timer_button}
                            />
                          }
                        />
                      </div>
                    );
                  })}
                </div>
                {/* stopwatch buttons */}
              </div>
            </AccordionItem>
          );
        })}
      </Accordion>
      <PopupButton
        triggerAction={undefined}
        triggerButtonContent={
          isPending ? (
            <ClipLoader
              color={"#EDF1FF"}
              loading={isPending}
              size={20}
              aria-label="Loading Spinner"
            />
          ) : (
            "End Session"
          )
        }
        isDisabled={isPending ? true : false}
        onCancel={undefined}
        onConfirm={() => {
          startTransition(() => {
            router.push("/stats");
            localStorage.removeItem("session");
          });
        }}
        buttonStyle={`${classes.button}`}
        title="Are you sure you want to end this session?"
        content="Make sure you've saved all exercises before ending your session to prevent any unsaved progress."
      />
    </div>
  );
}

export default Session;
