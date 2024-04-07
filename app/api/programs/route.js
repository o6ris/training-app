import Session from "@modules/server/models/session";
import Exercise from "@modules/server/models/exercise";
import Program from "@modules/server/models/program";
import connectDb from "@lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const program = await request.json();
    await connectDb();
    const sessionIds = program.sessions;
    for (const sessionId of sessionIds) {
      const sessionExists = await Session.exists({ _id: sessionId });
      if (!sessionExists) {
        throw { message: `Session with ID ${sessionId} does not exist`, status: 400 };
      }
    }
    const newProgram = Program(program);
    await newProgram.save();
    return NextResponse.json(
      newProgram,
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
    const programs = await Program.find();
    // Wait all promises
    const populatedPrograms = await Promise.all(
      programs.map(async (program) => {
        // For each program go to each session and add its name
        const populatedProgram = await Program.populate(program, {
          path: "sessions",
          model: Session,
        });
        const populatedSessions = populatedProgram.sessions;
        await Promise.all(
          populatedSessions.map(async (session) => {
            await Exercise.populate(session, {
              path: "training.exercise",
              model: Exercise,
              select: "name",
            });
          })
        );
        return populatedProgram;
      })
    );
    return NextResponse.json(populatedPrograms, { status: 200 });
  } catch (err) {
    const { message, status } = err;
    return NextResponse.json({ message, status }, { status: status || 404 });
  }
}
