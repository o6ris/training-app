import Session from "@modules/server/models/session";
import Exercise from "modules/server/models/exercise";
import connectDb from "@lib/mongodb";
import { NextResponse } from "next/server";
import checkId from "modules/server/utils/checkId";

export async function GET(request, props) {
  const params = await props.params;
  try {
    const { id } = params;
    if (!checkId(id)) {
      throw { message: "Wrong id", status: 500 };
    }
    await connectDb();
    const session = await Session.findById(id).populate({
      path: "exercises",
      model: Exercise,
    });

    return NextResponse.json(session, { status: 200 });
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
    const deletedSession = await Session.findByIdAndDelete(id);
    return NextResponse.json(
      deletedSession,
      { message: "Session deleted" },
      { status: 200 }
    );
  } catch (err) {
    const { message, status } = err;
    return NextResponse.json({ message, status }, { status: status || 500 });
  }
}

export async function PATCH(request, props) {
  const params = await props.params;
  try {
    const { id } = params;
    if (!checkId(id)) {
      throw { message: "Wrong id", status: 500 };
    }
    const session = await request.json();
    await connectDb();
    const updtatedSession = await Session.findByIdAndUpdate(id, session, {
      new: true,
      runValidators: true,
    });
    return NextResponse.json(
      updtatedSession,
      { message: "Session deleted" },
      { status: 200 }
    );
  } catch (err) {
    const { message, status } = err;
    return NextResponse.json({ message, status }, { status: status || 500 });
  }
}
