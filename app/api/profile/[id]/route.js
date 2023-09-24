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
    return NextResponse.json(errors, { status: 404 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params
    await connectDb();
    await Profile.findByIdAndDelete(id);
    return NextResponse.json({message: "Profile deleted"})
  } catch (err) {
    return NextResponse.json({message: "Error"}, {status: 404});
  }
}

export async function GET(request, { params }) {
  try {
    const { id } = params;
    await connectDb();
    const profile = await Profile.findById(id);
    return NextResponse.json(profile, {status: 200});
  } catch(err) {
    const { errors } = err;
    return NextResponse.json(errors, {status: 404});
  }
}
