import Stats from "@modules/server/models/stats";
import Exercise from "modules/server/models/exercise";
import User from "@modules/server/models/user";
import connectDb from "@lib/mongodb";
import checkId from "modules/server/utils/checkId";
import { startOfMonth, endOfMonth } from "date-fns";
import { NextResponse } from "next/server";

export async function GET(request) {
  const user = request.nextUrl.searchParams.get("user");
  const month = request.nextUrl.searchParams.get("month");

  try {
    await connectDb();

    if (!month || isNaN(month) || parseInt(month) < 1 || parseInt(month) > 12) {
      throw { message: "Invalid month parameter", status: 400 };
    }

    if (!checkId(user)) {
      throw { message: "Wrong id", status: 500 };
    }
    const profileExist = await User.exists({ _id: user });
    if (!profileExist) {
      throw {
        message: `User with ID ${user} does not exist`,
        status: 400,
      };
    }

    const year = new Date().getFullYear();
    const monthNumber = parseInt(month);

    const startOfMonthDate = new Date(Date.UTC(year, monthNumber - 1, 1));
    const endOfMonthDate = new Date(Date.UTC(year, monthNumber, 1));

    const stats = await Stats.find({
      user: user,
      date: {
        $gte: startOfMonthDate,
        $lt: endOfMonthDate,
      },
    });

    return NextResponse.json(stats, { status: 200 });
  } catch (err) {
    const { message, status } = err;
    return NextResponse.json({ message, status }, { status: status || 404 });
  }
}
