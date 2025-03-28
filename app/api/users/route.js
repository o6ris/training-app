import User from "@modules/server/models/user";
// import Whitelisted from "@modules/server/models/whitelistedEmail";
import connectDb from "lib/mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    await connectDb();
    const emailExist = await User.findOne({ email });
    // const whiteListedEmailSet = new Set(await Whitelisted.distinct("email"));
    
    // if(!whiteListedEmailSet.has(email)) {
    //   throw { message: "Email is not whitelisted", status: 403 };
    // }
    
    if (emailExist) {
      throw { message: "Email already exist", status: 400 };
    }
    
    const hashedPasswords = await bcrypt.hash(password, 5);
    const newUser = new User({
      email,
      password: hashedPasswords,
    });

    await newUser.save();
    return NextResponse.json(
      newUser,
      { message: "User Created" },
      { status: 201 }
    );
  } catch (err) {
    const { message, status } = err;
    return NextResponse.json({ message, status }, { status: status || 404 });
  }
}

export async function GET(request) {
  const email = request.nextUrl.searchParams.get("email");
  try {
    await connectDb();
    if (email) {
      const user = await User.findOne({ email });
      if (!user) {
        throw { message: "User not found", status: 404 };
      }
      return NextResponse.json(user, { status: 200 });
    } else {
      const profiles = await User.find();
      return NextResponse.json(profiles, { status: 200 });
    }
  } catch (err) {
    const { message, status } = err;
    return NextResponse.json({ message, status }, { status: status || 500 });
  }
}
