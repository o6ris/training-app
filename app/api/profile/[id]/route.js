import Profile from "@modules/server/models/profile";
import connectDb from "lib/mongodb";
import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const profile = await request.json();
    await connectDb();
    await Profile.findByIdAndUpdate(id, profile, { runValidators: true });
    return NextResponse.json(profile, { status: 200 });
  } catch (err) {
    const { errors } = err;
    return NextResponse.json(errors, { status: 400 });
  }
}
