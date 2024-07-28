import Stats from "@modules/server/models/stats";
import Exercise from "modules/server/models/exercise";
import User from "@modules/server/models/user";
import connectDb from "@lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const stats = await request.json();
    const exerciseId = stats.exercise;
    const profileId = stats.user;
    await connectDb();
    const exerciseExist = await Exercise.exists({ _id: exerciseId });
    const profileExist = await User.exists({ _id: profileId });
    if (!exerciseExist) {
      throw {
        message: `Exercise with ID ${exerciseId} does not exist`,
        status: 400,
      };
    }
    if (!profileExist) {
      throw {
        message: `User with ID ${profileId} does not exist`,
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
  const user = request.nextUrl.searchParams.get("user");
  const range = request.nextUrl.searchParams.get("range");

  try {
    await connectDb();

    let dateFilter = {};

    // Calculate the start date based on the range
    const now = new Date();
    let startDate;

    switch (range) {
      case "month":
        startDate = new Date(now.setDate(now.getDate() - 30));
        break;
      case "trim":
        startDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case "sem":
        startDate = new Date(now.setMonth(now.getMonth() - 6));
        break;
      case "year":
        startDate = new Date(now.setMonth(now.getMonth() - 12));
        break;
      default:
        startDate = new Date(0);
    }

    // Apply the date filter if a range was specified
    if (startDate) {
      dateFilter = { $gte: startDate };
    }

    console.log("dateFilter", dateFilter);

    const stats = await Stats.find({
      user: user,
      date: { ...dateFilter },
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
    return NextResponse.json(stats, { status: 200 });
  } catch (err) {
    const { message, status } = err;
    return NextResponse.json({ message, status }, { status: status || 404 });
  }
}
