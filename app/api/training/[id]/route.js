import Training from "@modules/server/models/training";
import Muscle from "@modules/server/models/muscle";
import Exercise from "@modules/server/models/exercise";
import connectDb from "@lib/mongodb";
import { NextResponse } from "next/server";
import checkId from "@modules/server/utils/checkId";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    if (!checkId(id)) {
      throw { message: "Wrong id", status: 500 };
    }
    await connectDb();
    const training = await Training.findById(id).populate({
      path: 'training.muscle',
      model: Muscle,
      select: 'name',
    });
    const populatedMuscles = await Promise.all(
      training.training.map(async (muscle) => {
        // For each muscle go to each exercise and add its name
        const populatedMuscle = await Training.populate(muscle, {
          path: "exercises.exercise",
          model: Exercise,
          select: "name",
        });
        return populatedMuscle;
      })
    );
    training.training = populatedMuscles;
    console.log("training", training);
    return NextResponse.json(training, { status: 200 });
  } catch (err) {
    const { message, status } = err;
    return NextResponse.json({ message, status }, { status: status || 404 });
  }
}
