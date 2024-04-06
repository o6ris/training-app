import Stats from "@modules/server/models/stats";
import Exercise from "@modules/server/models/exercise";
import Profile from "@modules/server/models/profile";
import connectDb from "@lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const stats = await request.json();
    const exerciseId = stats.exercise;
    const profileId = stats.profile;
    await connectDb();
    const exerciseExist = await Exercise.exists({ _id: exerciseId });
    const profileExist = await Profile.exists({ _id: profileId });
    if (!exerciseExist) {
      throw {
        message: `Exercise with ID ${exerciseId} does not exist`,
        status: 400,
      };
    }
    if (!profileExist) {
      throw {
        message: `Profile with ID ${profileId} does not exist`,
        status: 400,
      };
    }
    const newStats = Stats(stats);
    await newStats.save();
    return NextResponse.json(
      newStats,
      { message: "Stats created" },
      { status: 201 }
    );
  } catch (err) {
    const { message, status } = err;
    return NextResponse.json({ message, status }, { status: status || 404 });
  }
}

export async function GET(request) {
  try {
    await connectDb();
    // TODO: get by profil connected (NextAuth ?)
    const stats = await Stats.find().populate([
      {
        path: "exercise",
        model: Exercise,
        select: "name",
      },
      {
        path: "profile",
        model: Profile,
        select: "name",
      },
    ]);
    return NextResponse.json(stats, { status: 200 });
  } catch (err) {
    const { message, status } = err;
    return NextResponse.json({ message, status }, { status: status || 404 });
  }
}
