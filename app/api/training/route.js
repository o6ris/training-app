import Training from "@modules/server/models/training";
import connectDb from "@lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const training = await request.json();
    await connectDb();
    const newTraining = await Training.create(training);
    console.log(newTraining)
    return NextResponse.json(newTraining, { message: "Training Created" }, { status: 201 });
  } catch (err) {
    const { message, status } = err;
    return NextResponse.json({ message, status }, { status: status || 404 });
  }
}