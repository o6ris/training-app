import Stats from "@modules/server/models/stats";
import Exercise from "@modules/server/models/exercise";
import Profile from "@modules/server/models/profile";
import connectDb from "@lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    console.log(id)
    await connectDb();
    // TODO: get by profil connected (NextAuth ?)
    const stats = await Stats.find({
      exercise: id
    }).populate([
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