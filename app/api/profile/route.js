import Profile from "@modules/server/models/profile";
import connectDb from "lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  const data = await request.json();
  await connectDb();
  console.log("connected to db");
  console.log(data)
  await Profile.create(data);
  console.log(
    NextResponse.json({ message: "Profile Created" }, { status: 201 })
  );
  return NextResponse.json({ message: "Profile Created" }, { status: 201 })
}
