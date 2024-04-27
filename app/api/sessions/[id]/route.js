import Session from "@modules/server/models/session";
import Exercise from "modules/server/models/exercise";
import connectDb from "@lib/mongodb";
import { NextResponse } from "next/server";
import checkId from "modules/server/utils/checkId";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    if (!checkId(id)) {
      throw { message: "Wrong id", status: 500 };
    }
    await connectDb();
    const session = await Session.findById(id).populate({
      path: "training.exercise",
      model: Exercise,
      select: "name",
    });

    return NextResponse.json(session, { status: 200 });
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
    const deletedSession = await Session.findByIdAndDelete(id);
    return NextResponse.json(
      deletedSession,
      { message: "Session deleted" },
      { status: 200 }
    );
  } catch (err) {
    const { message, status } = err;
    return NextResponse.json({ message, status }, { status: status || 404 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    if (!checkId(id)) {
      throw { message: "Wrong id", status: 500 };
    }
    const session = await request.json();
    await connectDb();
    const updtatedSession = await Session.findByIdAndUpdate(
      id,
      session,
      { new: true },
      { runValidators: true }
    );
    return NextResponse.json(
      updtatedSession,
      { message: "Session deleted" },
      { status: 200 }
    );
  } catch (err) {
    const { message, status } = err;
    return NextResponse.json({ message, status }, { status: status || 404 });
  }
}
