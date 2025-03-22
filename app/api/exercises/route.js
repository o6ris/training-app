import Exercise from "modules/server/models/exercise";
import Muscle from "@modules/server/models/muscle";
import connectDb from "@lib/mongodb";
import { NextResponse } from "next/server";
import { models } from "mongoose";
import checkId from "modules/server/utils/checkId";

export async function POST(request) {
  try {
    // TODO: validate body data before POST
    const body = await request.json();
    await connectDb();
    const exercises = Array.isArray(body) ? body : [body];
    const createdExercises = [];
    for (const item of exercises) {
      // Validate the muscle ID
      const muscle = await Muscle.findById(item.muscle);
      if (!muscle) {
        throw { message: `Muscle ID ${item.muscle} not found`, status: 400 };
      }

      // Create a new exercise for each item
      const exercise = new models.Exercise({
        muscle: muscle,
        name: item.name,
        description: item.description,
        image: item.image,
      });

      const newExercise = await Exercise.create(exercise);
      createdExercises.push(newExercise);
    }
    return NextResponse.json(
      { message: "Exercises Created", exercises: createdExercises },
      { status: 201 }
    );
  } catch (err) {
    const { message, status } = err;
    return NextResponse.json({ message, status }, { status: status || 404 });
  }
}

export async function GET(request, { params }) {
  try {
    await connectDb();
    const muscles = request.nextUrl.searchParams.getAll("muscle");
    const exercisesId = request.nextUrl.searchParams.getAll("exercise");

    const storeUniqueId = (allExercises, exercises) => {
      // Create a Map to store unique exercises by their _id
      const exerciseMap = new Map();
      // Merge allExercises and exercises and iterate ofdver them
      [...allExercises, ...exercises].forEach((exercise) => {
        // Store each exercise in the Map using _id as the key
        // If an exercise with the same _id already exists, it will be replaced
        exerciseMap.set(exercise._id.toString(), exercise);
      });
      // Convert the Map values (unique exercises) back into an array
      return Array.from(exerciseMap.values());
    };

    const findExercises = async () => {
      let allExercises = [];
      if (muscles.length > 0) {
        for (const muscle of muscles) {
          if (!checkId(muscle) && muscle !== "all") {
            throw { message: "Wrong id", status: 500 };
          } else if (checkId(muscle) && muscle !== "all") {
            const exercises = await Exercise.find({
              muscle: { $in: [muscle] },
            });
            allExercises = storeUniqueId(allExercises, exercises);
          } else if (!checkId(muscle) && muscle === "all") {
            const exercises = await Exercise.find();
            allExercises = storeUniqueId(allExercises, exercises);
          }
        }
        return allExercises;
      } else if (exercisesId.length > 0) {
        for (const id of exercisesId) {
          if (!checkId(id)) {
            throw { message: "Wrong id", status: 500 };
          }
          const exercises = await Exercise.find({ _id: id });

          // Create a Map to store unique exercises by their _id
          const exerciseMap = new Map();
          // Merge allExercises and exercises and iterate over them
          [...allExercises, ...exercises].forEach((exercise) => {
            // Store each exercise in the Map using _id as the key
            // If an exercise with the same _id already exists, it will be replaced
            exerciseMap.set(exercise._id.toString(), exercise);
          });
          // Convert the Map values (unique exercises) back into an array
          allExercises = Array.from(exerciseMap.values());
        }
        return allExercises;
      }
    };
    const exercises = await findExercises();
    if (!exercises) {
      throw { message: "Not found", status: 400 };
    }
    const populatedExercises = await Promise.all(
      exercises.map(async (exercise) => {
        const populatedExercise = await Exercise.populate(exercise, {
          path: "muscle",
          select: "name",
        });
        return populatedExercise;
      })
    );
    return NextResponse.json(populatedExercises, { status: 200 });
  } catch (err) {
    const { message, status } = err;
    return NextResponse.json({ message, status }, { status: status || 404 });
  }
}
