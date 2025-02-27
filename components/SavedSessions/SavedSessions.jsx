"use client";

import classes from "./savedSessions.module.css";
import { Accordion, AccordionItem, Avatar, Image } from "@heroui/react";
function SavedSession({ workouts }) {
  const cloudinaryUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`;
  console.log("workouts", workouts);

  return (
    <Accordion variant="splitted">
      {workouts.map((workout, i) => {
        return (
          <AccordionItem
            key={i + 1}
            aria-label={workout.name}
            title={workout.name}
            subtitle={`${workout.exercises.length} exercises`}
            classNames={{
              base: classes.accordion_item,
              title: classes.accordion_title,
            }}
          >
            {workout.exercises.map((exercise) => {
              return (
                <div
                  key={exercise._id}
                  className={classes.exercise_desc_content}
                >
                  <div className={classes.exercise_title}>
                    <Avatar
                      showFallback
                      className="w-12 h-12"
                      name={exercise?.name}
                      src={`${cloudinaryUrl}${exercise?.image}`}
                    />
                    <h2>{exercise.name}</h2>
                  </div>
                  <div>
                    <h3>Steps:</h3>
                    <p>{exercise.description.steps}</p>
                  </div>
                  <div>
                    <h3>Benefits:</h3>
                    <p>{exercise.description.benefits}</p>
                  </div>
                  <div>
                    <h3>Mistakes</h3>
                    <p>{exercise.description.mistakes}</p>
                  </div>
                </div>
              );
            })}
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

export default SavedSession;
