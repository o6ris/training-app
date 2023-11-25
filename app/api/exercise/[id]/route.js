import Exercise from "@modules/server/models/exercise";
import connectDb from "@lib/mongodb";
import { NextResponse } from "next/server";
import checkId from "@modules/server/utils/checkId";

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const exercise = await request.json();
    await connectDb();
    const updatedExercise = await Exercise.findByIdAndUpdate(
      id,
      exercise,
      { new: true },
      { runValidators: true }
    );
    console.log(updatedExercise);
    return NextResponse.json(updatedExercise, { status: 200 });
  } catch (err) {
    const { errors } = err;
    return NextResponse.json(errors, { status: 404 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await connectDb();
    const deletedExercise = await Exercise.findByIdAndDelete(id);
    return NextResponse.json(deletedExercise);
  } catch (err) {
    return NextResponse.json({ message: "Error" }, { status: 404 });
  }
}

export async function GET(request, { params }) {
  try {
    const { id } = params;
    if (!checkId(id)) {
      throw { message: "Wrong id", status: 500 };
    }
    await connectDb();
    const exercise = await Exercise.findById(id);
    if (!exercise) {
      throw { message: "Not found", status: 400 };
    }
    await exercise.populate({ path: "muscle", select: "name" });
    return NextResponse.json(exercise, { status: 200 });
  } catch (err) {
    const { message, status } = err;
    return NextResponse.json({ message, status }, { status: status || 404 });
  }
}
