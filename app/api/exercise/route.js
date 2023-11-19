import Exercise from "@modules/server/models/exercise";
import Muscle from "@modules/server/models/muscle";
import connectDb from "@lib/mongodb";
import { NextResponse } from "next/server";
import { models } from "mongoose";

export async function POST(request) {
  try {
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
    const { errors } = err;
    return NextResponse.json(errors, { status: 400 });
  }
}

export async function GET(request, { params }) {
  try {
    const muscle_id = request?.url.split("=")[1];
    await connectDb();
    const findExercises = async () => {
      if (muscle_id) {
        console.log(muscle_id);
        return Exercise.find({ muscle: muscle_id });
      }
      return Exercise.find();
    };
    console.log("before", await findExercises());
    const exercises = await findExercises();
    const populatedExercises = [];
    for (const exercise of exercises) {
      const populatedExercise = await exercise
        .populate({
          path: "muscle",
          select: "name",
        })
      populatedExercises.push(populatedExercise);
      console.log("populatedExercise", populatedExercise);
    }

    console.log("after", populatedExercises);
    return NextResponse.json(populatedExercises, { status: 200 });
  } catch (err) {
    const { errors } = err;
    return NextResponse.json(errors, { status: 404 });
  }
}
