import Stats from "@modules/server/models/stats";
import Exercise from "modules/server/models/exercise";
import User from "@modules/server/models/user";
import connectDb from "@lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  const user = request.nextUrl.searchParams.get("user");
  const date = request.nextUrl.searchParams.get("date");

  console.log("date", new Date(date));
  console.log("user", user);

  try {
    await connectDb();

    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const stats = await Stats.find({
      user: user,
      date: { $gte: startOfDay, $lt: endOfDay },
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
