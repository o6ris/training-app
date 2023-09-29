import Exercise from "@modules/server/models/exercise";
import connectDb from "@lib/mongodb";
import { NextResponse } from "next/server";

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
    await connectDb();
    const exercise = await Exercise.findById(id);
    return NextResponse.json(exercise, { status: 200 });
  } catch (err) {
    const { errors } = err;
    return NextResponse.json(errors, { status: 404 });
  }
}
