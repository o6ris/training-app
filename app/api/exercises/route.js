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
    const muscle = await Muscle.findById(body.muscle);
    const exercise = new models.Exercise({
      muscle: muscle,
      name: body.name,
    });
    const newExercise = await Exercise.create(exercise);
    return NextResponse.json(
      newExercise,
      { message: "Exercise Created" },
      { status: 201 }
    );
  } catch (err) {
    const { message, status } = err;
    return NextResponse.json({ message, status }, { status: status || 404 });
  }
}

export async function GET(request, { params }) {
  try {
    const muscle_id = request?.url.split("=")[1];
    const findExercises = async () => {
      if (muscle_id) {
        if (!checkId(muscle_id)) {
          throw { message: "Wrong id", status: 500 };
        }
        return Exercise.find({ muscle: muscle_id });
      }
      return Exercise.find();
    };
    const exercises = await findExercises();
    if (!exercises) {
      throw { message: "Not found", status: 400 };
    }
    await connectDb();
    const populatedExercises = await Promise.all(
      exercises.map(async (exercise) => {
        const populatedExercise = await Exercise.populate(exercise, {
          path: "muscle",
          select: "name",
        });
        return populatedExercise;
      })
    );
    // const populatedExercises = [];
    // for (const exercise of exercises) {
    //   const populatedExercise = await exercise.populate({
    //     path: "muscle",
    //     select: "name",
    //   });
    //   populatedExercises.push(populatedExercise);
    // }
    return NextResponse.json(populatedExercises, { status: 200 });
  } catch (err) {
    const { message, status } = err;
    return NextResponse.json({ message, status }, { status: status || 404 });
  }
}
