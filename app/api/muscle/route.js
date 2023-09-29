import Muscle from "@modules/server/models/muscle";
import connectDb from "@lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const muscle = await request.json();
    await connectDb();
    const newMuscle = await Muscle.create(muscle);
    return NextResponse.json(newMuscle, { message: "Muscle Created" }, { status: 201 });
  } catch (err) {
    const { errors } = err;
    return NextResponse.json(errors, { status: 400 });
  }
}

export async function GET() {
  try {
    await connectDb();
    const muscles = await Muscle.find();
    return NextResponse.json(muscles, { status: 200 });
  } catch (err) {
    const { errors } = err;
    return NextResponse.json(errors, { status: 404 });
  }
}