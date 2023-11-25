import Profile from "@modules/server/models/profile";
import connectDb from "lib/mongodb";
import { NextResponse } from "next/server";
import checkId from "@modules/server/utils/checkId";

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    if (!checkId(id)) {
      throw { message: "Wrong id", status: 500 };
    }
    const profile = await request.json();
    if (!profile) {
      throw { message: "Not found", status: 400 };
    }
    await connectDb();
    const updatedProfile = await Profile.findByIdAndUpdate(id, profile, {
      runValidators: true,
    });
    return NextResponse.json(
      updatedProfile,
      { message: "Profile updated" },
      { status: 202 }
    );
  } catch (err) {
    const { message, status } = err;
    return NextResponse.json({ message, status }, { status: status || 404 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    if (!checkId(id)) {
      throw { message: "Wrong id", status: 500 };
    }
    await connectDb();
    const deletedProfile = await Profile.findByIdAndDelete(id);
    return NextResponse.json(
      deletedProfile,
      { message: "Profile deleted" },
      { status: 202 }
    );
  } catch (err) {
    const { message, status } = err;
    return NextResponse.json({ message, status }, { status: status || 404 });
  }
}

export async function GET(request, { params }) {
  try {
    const { id } = params;
    if (!checkId(id)) {
      throw { message: "Wrong id", status: 500 };
    }
    await connectDb();
    const profile = await Profile.findById(id);
    if (!profile) {
      throw { message: "Not found", status: 400 };
    }
    return NextResponse.json(profile, { status: 200 });
  } catch (err) {
    const { message, status } = err;
    return NextResponse.json({ message, status }, { status: status || 404 });
  }
}
