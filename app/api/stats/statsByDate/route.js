import Stats from "@modules/server/models/stats";
import Exercise from "modules/server/models/exercise";
import User from "@modules/server/models/user";
import connectDb from "@lib/mongodb";
import checkId from "modules/server/utils/checkId";
import { NextResponse } from "next/server";

export async function GET(request) {
  const user = request.nextUrl.searchParams.get("user");
  const date = request.nextUrl.searchParams.get("date");

  try {
    await connectDb();

    const profileExist = await User.exists({ _id: user });
    
    if (!checkId(user)) {
      throw { message: "Wrong id", status: 500 };
    }
    if (!profileExist) {
      throw {
        message: `User with ID ${user} does not exist`,
        status: 400,
      };
    }

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
