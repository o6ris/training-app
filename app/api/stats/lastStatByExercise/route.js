import Stats from "@modules/server/models/stats";
import Exercise from "modules/server/models/exercise";
import User from "@modules/server/models/user";
import connectDb from "@lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  const user = request.nextUrl.searchParams.get("user");
  const exercises = request.nextUrl.searchParams.getAll("exercise");
  console.log("exercises", exercises);
  try {
    await connectDb();
    const stats = await Stats.find({
      user: user,
    }).populate([
      {
        path: "exercise",
        model: Exercise,
        select: "name",
      },
      {
        path: "user",
        model: User,
        select: "name",
      },
    ]);
    const latestExercise = [];

    exercises.forEach((exercise) => {
      // Filter all exercises that match the current one
      const matchingExercises = stats.filter(
        (el) => el.exercise._id.toHexString() === exercise
      );

      // If we have matching exercises, find the one with the most recent date
      if (matchingExercises.length > 0) {
        const mostRecentExercise = matchingExercises.reduce(
          (latest, current) => {
            return new Date(current.date) > new Date(latest.date)
              ? current
              : latest;
          }
        );

        latestExercise.push(mostRecentExercise); // Push the most recent one to the result array
      }
    });

    // console.log("stats", stats);
    console.log("latestExercise", latestExercise);
    return NextResponse.json(latestExercise, { status: 200 });
  } catch (err) {
    const { message, status } = err;
    return NextResponse.json({ message, status }, { status: status || 404 });
  }
}
