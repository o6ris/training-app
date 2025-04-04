import User from "@modules/server/models/user";
import connectDb from "lib/mongodb";
import { NextResponse } from "next/server";
import checkId from "modules/server/utils/checkId";
import bcrypt from "bcrypt";

export async function PATCH(request, props) {
  const params = await props.params;
  try {
    const { id } = params;
    await connectDb();
    if (!checkId(id)) {
      throw { message: "Wrong id", status: 500 };
    }
    const user = await request.json();
    if (!user) {
      throw { message: "Not found", status: 400 };
    }
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 5);
    }
    const updatedProfile = await User.findByIdAndUpdate(id, user, {
      runValidators: true,
    });
    return NextResponse.json(
      updatedProfile,
      { message: "User updated" },
      { status: 202 }
    );
  } catch (err) {
    const { message, status } = err;
    return NextResponse.json({ message, status }, { status: status || 404 });
  }
}

export async function DELETE(request, props) {
  const params = await props.params;
  try {
    const { id } = params;
    if (!checkId(id)) {
      throw { message: "Wrong id", status: 500 };
    }
    await connectDb();
    const deletedProfile = await User.findByIdAndDelete(id);
    return NextResponse.json(
      deletedProfile,
      { message: "User deleted" },
      { status: 202 }
    );
  } catch (err) {
    const { message, status } = err;
    return NextResponse.json({ message, status }, { status: status || 404 });
  }
}

export async function GET(request, props) {
  const params = await props.params;
  try {
    const { id } = params;
    if (!checkId(id)) {
      throw { message: "Wrong id", status: 500 };
    }
    await connectDb();
    const user = await User.findById(id);
    if (!user) {
      throw { message: "Not found", status: 400 };
    }
    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    const { message, status } = err;
    return NextResponse.json({ message, status }, { status: status || 404 });
  }
}
