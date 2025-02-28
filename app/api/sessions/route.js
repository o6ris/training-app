import Session from "@modules/server/models/session";
import Exercise from "modules/server/models/exercise";
import User from "@modules/server/models/user";
import connectDb from "@lib/mongodb";
import { NextResponse } from "next/server";
import checkId from "@modules/server/utils/checkId";

export async function POST(request) {
  try {
    const { email, name, exercises } = await request.json();
    await connectDb();
    const user = await User.findOne({ email: email });
    const findExercises = async () => {
      let allExercises = [];
      for (const id of exercises) {
        if (!checkId(id)) {
          throw { message: "Wrong id", status: 500 };
        }
        const exercise = await Exercise.findOne({ _id: id });
        allExercises.push(exercise._id);
      }
      return allExercises;
    };

    const exercisesList = await findExercises();
    const newSession = new Session({
      user: user._id,
      exercises: exercisesList,
      name: name,
    });

    await newSession.save();
    return NextResponse.json(
      newSession,
      { message: "Exercises saved" },
      { status: 201 }
    );
  } catch (err) {
    const { message, status } = err;
    return NextResponse.json({ message, status }, { status: status || 404 });
  }
}

export async function GET(request) {
  const email = request.nextUrl.searchParams.get("email");
  try {
    await connectDb();
    const user = await User.findOne({ email: email });
    if (!checkId(user._id)) {
      throw { message: "User dosen't exist", status: 500 };
    }
    const session = await Session.find({ user: user._id }).populate({
      path: "exercises",
      model: Exercise,
    });

    return NextResponse.json(session, { status: 200 });
  } catch (error) {
    const { message, status } = error;
    return NextResponse.json(
      { message: message ?? "Unknown Error", status: status ?? 500 },
      { status: status ?? 500 }
    );
  }
}
