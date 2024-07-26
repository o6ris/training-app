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

  function calculateStartDate(monthsAgo) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
  
    // Adjust for the monthsAgo to get the correct year and month
    const calculatedMonth = month - monthsAgo;
    const startYear = year + Math.floor(calculatedMonth / 12);
    const startMonth = (calculatedMonth % 12 + 12) % 12;
  
    return new Date(Date.UTC(startYear, startMonth, 1));
  }

  console.log("user", user);

  try {
    await connectDb();

    let dateFilter = {};

    // Calculate the start date based on the range
    const now = new Date();
    let startDate;

    switch (range) {
      case "month":
        startDate = calculateStartDate(0); // Current month
        break;
      case "trim":
        startDate = calculateStartDate(2); // Last 3 months
        break;
      case "sem":
        startDate = calculateStartDate(5); // Last 6 months
        break;
      case "year":
        startDate = calculateStartDate(11); // Last 12 months
        break;
      default:
        startDate = new Date(0); // No range specified, fetch all stats
    }

    // Apply the date filter if a range was specified
    if (startDate) {
      dateFilter = { $gte: startDate  };
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
    console.log("stats", stats);
    return NextResponse.json(stats, { status: 200 });
  } catch (err) {
    const { message, status } = err;
    return NextResponse.json({ message, status }, { status: status || 404 });
  }
}
