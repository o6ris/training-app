import Session from "@modules/server/models/session";
import Exercise from "modules/server/models/exercise";
import connectDb from "@lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const session = await request.json();
    console.log("session", session)
    await connectDb();
    const renderSession = async () => {
      if (Array.isArray(session)) {
        return await Session.insertMany(session);
      } else {
        return await Session.create(session);
      }
    };
    const newSession = await renderSession();
    return NextResponse.json(
      newSession,
      { message: "Session Created" },
      { status: 201 }
    );
  } catch (err) {
    const { message, status } = err;
    return NextResponse.json({ message, status }, { status: status || 404 });
  }
}

export async function GET() {
  try {
    await connectDb();
    const sessions = await Session.find();
    // Wait all promises
    const populatedSessions = await Promise.all(
      sessions.map(async (session) => {
        // For each session go to each exercise and add its name
        const populatedSession = await Session.populate(session, {
          path: "exercises.exercise",
          model: Exercise,
          select: "name",
        });
        return populatedSession;
      })
    );
    return NextResponse.json(populatedSessions, { status: 200 });
  } catch (err) {
    const { message, status } = err;
    return NextResponse.json({ message, status }, { status: status || 404 });
  }
}
