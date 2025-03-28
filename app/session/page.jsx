"use client";

import { useState, useEffect, useContext, useTransition } from "react";
import { useRouter } from "next/navigation";
import classes from "./session.module.css";
import WorkoutContext from "@modules/client/contexts/workoutProvider";
import { Accordion, AccordionItem, Image } from "@heroui/react";
import NextImage from "next/image";
import useTimer from "@modules/client/utils/useTimer";
import InputField from "@core/ui/Fields/InputField/InputField";
import SelectField from "@core/ui/Fields/SelectField/SelectField";
import BasicButton from "@core/ui/Button/BasicButton";
import PopupButton from "@core/ui/Button/PopupButton";
import Icon from "@core/ui/Icons/Icon";
import useExercises from "@modules/client/requests/useExercises";
import Skeleton from "@core/ui/Skeleton/Skeleton";
import ClipLoader from "react-spinners/ClipLoader";
import ResetButton from "@components/CtaButton/ResetButton";
import SaveButton from "@components/CtaButton/SaveButton";
import StopwatchButton from "@components/CtaButton/StopwatchButton";
import useStopwatch from "@modules/client/utils/useStopwatch";

function Session() {
  const {
    session,
    setSession,
    handleOnChangeSession,
    handleAddSets,
    handleOnchangeSets,
    resetExercise,
    exercisesId,
    setExercisesId,
  } = useContext(WorkoutContext);
  const { exercises, isLoading } = useExercises(exercisesId, "exercise");
  const [accordionKey, setAccordionKey] = useState(new Set(["1"]));
  const [isPending, startTransition] = useTransition();
  const { time, getSeconds, getMinutes, isRunning, start, pause, reset } =
    useStopwatch(false, session);
  const { startTimer, getFormattedTime, timers, resetTimers } =
    useTimer(session);

  const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}`;
  const router = useRouter();

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
          const timer = timers[i];
          return (
            <AccordionItem
              key={key}
              textValue={findExercise?.name || "Exercise"}
              title={
                <div className={classes.accordion_header_wrapper}>
                  <div className={classes.accordion_header}>
                    {isLoading ? (
                      <Skeleton width="40%" height="25px" />
                    ) : (
                      <h3
                        className={
                          exercise.isFinished ? classes.title_name_finish : ""
                        }
                      >{`${findExercise?.name}`}</h3>
                    )}
                    <PopupButton
                      isIconOnly={true}
                      startContent={
                        <Icon
                          name="Info"
                          size={16}
                          color={exercise.isFinished ? "#05ba8f" : "white"}
                          strokeWidth={3}
                        />
                      }
                      buttonStyle={classes.icon_button}
                      title={
                        <div className={classes.accordion_title}>
                          <PopupButton
                            isIconOnly={true}
                            startContent={
                              <Image
                                as={NextImage}
                                src={findExercise?.tiny_image}
                                alt={findExercise?.name}
                                height={40}
                                width={40}
                                unoptimized={true}
                                loading="lazy"
                              />
                            }
                            buttonStyle={classes.image_button}
                            closebutton={"Close"}
                            content={
                              <Image
                                as={NextImage}
                                isZoomed
                                src={`${imageUrl}${findExercise?.image}`}
                                alt={findExercise?.name}
                                height={400}
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
                  {exercise.isFinished && <Icon name="Check" color="#05ba8f" />}
                </div>
              }
              classNames={{
                base: exercise.isFinished
                  ? classes.accordion_item_finish
                  : classes.accordion_item,
              }}
            >
              <div className={classes.session_container}>
                <div className={classes.stopwatch_buttons}>
                  {/* Use it instead of stopwatchButton to prevent stopwatch to stop when we close the accordion */}
                  <StopwatchButton
                    i={i}
                    exercise={exercise}
                    time={time}
                    getSeconds={getSeconds}
                    getMinutes={getMinutes}
                    isRunning={isRunning}
                    start={start}
                    pause={pause}
                  />
                  <ResetButton
                    session={session}
                    handleOnChangeSession={handleOnChangeSession}
                    i={i}
                    exercise={exercise}
                    resetExercise={resetExercise}
                    time={time}
                    start={start}
                    pause={pause}
                    reset={reset}
                  />
                </div>
                {/* Choose RM */}
                <InputField
                  label={
                    <div className={classes.label_with_info}>
                      <span>1RM (kg)</span>
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
                        title={"What is exactly 1RM?"}
                        closebutton={"Close"}
                        content={
                          <div className={classes.modal_content}>
                            <p>
                              Your 1RM is the maximum weight you can lift for
                              one rep of a given exercise. It serves as a
                              benchmark to choose the appropriate weight for
                              your training goal.
                            </p>
                            <div>
                              <h3>How to do 1RM test?</h3>
                              <ul>
                                <li>
                                  <strong>Warm-Up:</strong> Start with 5-10
                                  minutes of light cardio, followed by dynamic
                                  stretching, and then warm-up sets (50-60% of
                                  your estimated 1RM).
                                </li>
                                <li>
                                  <strong>Gradual Increase:</strong> Start with
                                  a light weight, gradually increase by 5-10%
                                  after each successful attempt, performing 1-3
                                  reps per increase.
                                </li>
                                <li>
                                  <strong>Final Attempt:</strong> Rest for 2-4
                                  minutes between attempts. Your final attempt
                                  should be your maximum weight that you can
                                  lift for one rep with proper form.
                                </li>
                              </ul>
                            </div>
                            <div>
                              <h3>How to Estimate Your 1RM?</h3>
                              <p>
                                If you don&apos;t know your exact 1RM, you can
                                estimate it by performing a set of reps at a
                                weight you can handle, then using an equation
                                like the Epley formula:
                              </p>
                              <p>1RM = Weight × (1 + 0.0333 × Reps)</p>
                              <p>(e.g: 50kg x (1 + 0.333 * 12) = 63kg)</p>
                            </div>
                            <p>
                              As you continue to train and get stronger, your
                              1RM will naturally increase. Regularly adjusting
                              your 1RM every 4 - 6 weeks ensures that
                              you&apos;re always lifting an appropriate weight
                              for your current strength level and allows you to
                              continue making progress.
                            </p>
                          </div>
                        }
                      />
                    </div>
                  }
                  ariaLabel="One RM"
                  variant="bordered"
                  placeholder="Exemple: 100"
                  labelPlacement="outside"
                  isDisabled={exercise.isFinished}
                  value={exercise.rm}
                  onChange={(value) => {
                    if (Number(value) !== exercise.rm) {
                      return handleOnChangeSession("rm", Number(value), i);
                    }
                  }}
                  classNames={{
                    label: classes.label,
                    inputWrapper: classes.field_main_wrapper,
                    input: classes.field_value,
                  }}
                  type="number"
                  endContent="Kg"
                />
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
                    value={exercise?.restTime}
                    onChange={(value) => {
                      if (Number(value) !== exercise.restTime) {
                        return handleOnChangeSession(
                          "restTime",
                          Number(value),
                          i
                        );
                      }
                    }}
                    isDisabled={exercise.isFinished}
                    classNames={{
                      label: classes.label,
                      inputWrapper: classes.field_main_wrapper,
                      input: classes.field_value,
                    }}
                    min={0}
                    max={600}
                    type="number"
                  />
                  {/* Choose number of sets */}
                  <SelectField
                    items={Array.from({ length: 9 }, (_, i) => ({
                      key: String(i + 1),
                      value: i + 1,
                    }))}
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
                    placeholder="eg: 1"
                    labelPlacement="outside"
                    value={String(exercise?.sets.length)}
                    selectOnChange={(value) => {
                      if (
                        Number(Array.from(value).join("")) !==
                        exercise?.sets.length
                      ) {
                        return handleAddSets(
                          "sets",
                          Number(Array.from(value).join("")),
                          i
                        );
                      }
                    }}
                    isDisabled={exercise.isFinished}
                    classNames={{
                      label: classes.label,
                      trigger: classes.field_main_wrapper,
                      value: classes.field_value,
                      popoverContent: classes.select_listbox_container,
                      listbox: classes.select_listbox,
                    }}
                    isMultiline={false}
                  />
                </div>
                <PopupButton
                  triggerAction={() => !timer?.isRunning && resetTimers()}
                  triggerButtonContent={
                    timer?.isRunning
                      ? getFormattedTime(timer.seconds)
                      : "Start rest time"
                  }
                  buttonStyle={classes.timer_button}
                  closebutton={"Close"}
                  isDisabled={
                    exercise.isFinished ||
                    (timers.some((timer) => timer.isRunning) &&
                      !timer?.isRunning)
                  }
                  content={
                    <BasicButton
                      onAction={() => startTimer(i)}
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
                        (timer?.isRunning === false && timer?.seconds === 0) ||
                        exercise.isFinished
                      }
                      buttonStyle={classes.timer_button}
                    />
                  }
                />
                {/* Choose reps and weight */}
                <div className={classes.sets_container}>
                  {exercise.sets.map((set, index) => {
                    return (
                      <div key={index} className={classes.set_container}>
                        <InputField
                          ariaLabel="repetions"
                          label={
                            index === 0 && (
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
                                        The number of reps you perform
                                        determines the type of gains you&apos;ll
                                        achieve. The ideal rep range depends on
                                        the weight you lift, the number of sets,
                                        and your rest time.
                                      </p>
                                      <div>
                                        <h3>
                                          How to Choose the Right Number of
                                          Reps?
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
                                            for hypertrophy, balancing tension
                                            and volume.
                                          </li>
                                          <li>
                                            - Endurance (Light weight, short
                                            rest, lower sets):{" "}
                                            <strong>12+ reps.</strong> Enhances
                                            muscular endurance and stamina.
                                          </li>
                                        </ul>
                                      </div>
                                      <p>
                                        By adjusting your reps based on weight,
                                        sets, and rest time, you&rsquo;ll
                                        optimize your training for better
                                        results and progression!
                                      </p>
                                    </div>
                                  }
                                />
                              </div>
                            )
                          }
                          variant="bordered"
                          value={set.reps}
                          type="number"
                          min={1}
                          onChange={(value) => {
                            if (Number(value) !== set.reps) {
                              handleOnchangeSets(
                                "reps",
                                Number(value),
                                i,
                                index
                              );
                            }
                          }}
                          classNames={{
                            label: classes.label,
                            inputWrapper: classes.field_main_wrapper,
                            input: classes.field_value,
                          }}
                          isDisabled={exercise.isFinished}
                        />
                        <InputField
                          ariaLabel="weight"
                          label={
                            index === 0 && (
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
                                        The weight you lift directly impacts
                                        your strength, muscle growth, and
                                        endurance. Choosing the right weight
                                        depends on the number of reps, sets, and
                                        your rest time to match your training
                                        goal.
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
                                            Improves muscular endurance with
                                            high reps and minimal rest.
                                          </li>
                                        </ul>
                                      </div>
                                      <div>
                                        <h3>
                                          How to know if your weight is correct?
                                        </h3>
                                        <ul>
                                          <li>
                                            - If you can&rsquo;t complete your
                                            reps with proper form, reduce the
                                            weight.
                                          </li>
                                          <li>
                                            - If you can do more reps than
                                            planned easily, increase the weight.
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
                            )
                          }
                          variant="bordered"
                          value={set.weight}
                          type="number"
                          min={1}
                          onChange={(value) => {
                            if (Number(value) !== set.weight) {
                              handleOnchangeSets(
                                "weight",
                                Number(value),
                                i,
                                index
                              );
                            }
                          }}
                          classNames={{
                            label: classes.label,
                            inputWrapper: classes.field_main_wrapper,
                            input: classes.field_value,
                          }}
                          isDisabled={exercise.isFinished}
                        />
                      </div>
                    );
                  })}
                </div>
                {/* save button */}
                <SaveButton
                  handleOnChangeSession={handleOnChangeSession}
                  session={session}
                  i={i}
                  exercise={exercise}
                  time={time}
                  start={start}
                  pause={pause}
                />
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
