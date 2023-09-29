import Exercise from "@modules/server/models/exercise";
import connectDb from "@lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const exercise = await request.json();
    await connectDb();
    const newExercise = await Exercise.create(exercise);
    return NextResponse.json(newExercise, { message: "Exercise Created" }, { status: 201 });
  } catch (err) {
    const { errors } = err;
    return NextResponse.json(errors, { status: 400 });
  }
}

export async function GET(request, { params }) {
  
  try {
    const muscle_id = request?.url.split('=')[1]
    await connectDb();
    const findExercises = async () => {
      if (muscle_id) {
        return await Exercise.find({ muscle: muscle_id });
      }
      return await Exercise.find();
    }
    const exercises = await findExercises();
    return NextResponse.json(exercises, { status: 200 });
  } catch (err) {
    const { errors } = err;
    return NextResponse.json(errors, { status: 404 });
  }
}