import Stats from "@modules/server/models/stats";
import Exercise from "modules/server/models/exercise";
import User from "@modules/server/models/user";
import connectDb from "@lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(request, props) {
  const params = await props.params;
  try {
    const { id } = params;
    await connectDb();
    // TODO: get by profil connected (NextAuth ?)
    const stats = await Stats.findById(id).populate([
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
