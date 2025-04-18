import nodemailer from "nodemailer";
import connectDb from "lib/mongodb";
import User from "@modules/server/models/user";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    const email = await request.json();
    await connectDb();
    const emailExist = await User.findOne({ email });

    if (!emailExist) {
      throw { message: "Email doesn't exist", status: 400 };
    }
    const token = jwt.sign({ email: email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Configure Nodemailer with Brevo SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });


    // const transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     user: process.env.EMAIL_USERNAME,
    //     pass: process.env.EMAIL_PASSWORD,
    //   },
    //   tls: {
    //     rejectUnauthorized: false,
    //   },
    // });

    const emailSent = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Reset Your Password",
      html: `Click the <a href ="${process.env.NEXT_PUBLIC_API_URL}/resetPassword?token=${token}">link</a> to reset your password `,
    });

    return NextResponse.json((emailSent, { message: "Reset email sent!" }), {
      status: 200,
    });
  } catch (error) {
    const { message, status } = error;
    return NextResponse.json(
      { message: message ?? "Unknown Error", status: status ?? 500 },
      { status: status ?? 500 }
    );
  }
}
