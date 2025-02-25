import connectDb from "lib/mongodb";
import User from "@modules/server/models/user";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function PATCH(request) {
  try
  {
    const { token, password } = await request.json();
    await connectDb();

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded)
    {
      throw { message: "Invalid or expired token", status: 400 };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.findOne({ email: decoded.email });

    user.password = hashedPassword

    await user.save()

    return NextResponse.json((user, { message: "Password updated!" }),
      { status: 200 }
    );
  } catch (error)
  {
    const { message, status } = error;
    return NextResponse.json(message ?? 'Unknown Error', {
      status: status ?? 500,
    });
  }
}
