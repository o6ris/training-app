import Profile from "@modules/server/models/profile";
import connectDb from "lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const profile = await request.json();
    await connectDb();
    await Profile.create(profile);
    return NextResponse.json({ message: "Profile Created" }, { status: 201 });
  } catch (err) {
    const { errors } = err;
    return NextResponse.json(errors, { status: 400 });
  }
}

export async function GET() {
  try {
    await connectDb();
    const profiles = await Profile.find();
    return NextResponse.json(profiles, { status: 200 });
  } catch (err) {
    const { errors } = err;
    return NextResponse.json(errors, { status: 404 });
  }
}
