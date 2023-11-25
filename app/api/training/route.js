import Training from "@modules/server/models/training";
import Muscle from "@modules/server/models/muscle";
import Exercise from "@modules/server/models/exercise";
import connectDb from "@lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const training = await request.json();
    await connectDb();
    const newTraining = await Training.create(training);
    return NextResponse.json(
      newTraining,
      { message: "Training Created" },
      { status: 201 }
    );
  } catch (err) {
    const { message, status } = err;
    return NextResponse.json({ message, status }, { status: status || 404 });
  }
}

export async function GET() {
  try {
    await connectDb();
    const trainings = await Training.find();
    // Wait all promises
    const populatedTrainings = await Promise.all(
      trainings.map(async (training) => {
        // For each training go to each muscle and add its name
        const populatedTraining = await Training.populate(training, {
          path: "training.muscle",
          model: Muscle,
          select: "name",
        });
        // Wait all promises
        const populatedMuscles = await Promise.all(
          populatedTraining.training.map(async (muscle) => {
            // For each muscle go to each exercise and add its name
            const populatedMuscle = await Training.populate(muscle, {
              path: "exercises.exercise",
              model: Exercise,
              select: "name",
            });
            return populatedMuscle;
          })
        );
        populatedTraining.training = populatedMuscles;
        return populatedTraining;
      })
    );
    return NextResponse.json(populatedTrainings, { status: 200 });
  } catch (err) {
    const { message, status } = err;
    return NextResponse.json({ message, status }, { status: status || 404 });
  }
}
