import Muscle from "@modules/server/models/muscle";
import connectDb from "@lib/mongodb";
import { NextResponse } from "next/server";
import checkId from "@modules/server/utils/checkId";

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    if (!checkId(id)) {
      throw { message: "Wrong id", status: 500 };
    }
    const muscle = await request.json();
    if (!muscle) {
      throw { message: "Not found", status: 400 };
    }
    await connectDb();
    const updatedMuscle = await Muscle.findByIdAndUpdate(
      id,
      muscle,
      { new: true },
      { runValidators: true }
    );
    return NextResponse.json(
      updatedMuscle,
      { message: "Muscle updated" },
      { status: 200 }
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
    const deletedMuscle = await Muscle.findByIdAndDelete(id);
    return NextResponse.json(
      deletedMuscle,
      { message: "Muscle deleted" },
      { status: 200 }
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
    const muscle = await Muscle.findById(id);
    if (!muscle) {
      throw { message: "Not found", status: 400 };
    }
    return NextResponse.json(muscle, { status: 200 });
  } catch (err) {
    const { message, status } = err;
    return NextResponse.json({ message, status }, { status: status || 404 });
  }
}
