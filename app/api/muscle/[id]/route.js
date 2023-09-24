import Muscle from "@modules/server/models/muscle";
import connectDb from "@lib/mongodb";
import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const muscle = await request.json();
    await connectDb();
    const updatedMuscle = await Muscle.findByIdAndUpdate(id, muscle, { runValidators: true });
    return NextResponse.json(updatedMuscle, { status: 200 });
  } catch (err) {
    const { errors } = err;
    return NextResponse.json(errors, { status: 404 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params
    await connectDb();
    const deletedMuscle = await Muscle.findByIdAndDelete(id);
    return NextResponse.json(deletedMuscle)
  } catch (err) {
    return NextResponse.json({message: "Error"}, {status: 404});
  }
}

export async function GET(request, { params }) {
  try {
    const { id } = params;
    await connectDb();
    const muscle = await Muscle.findById(id);
    return NextResponse.json(muscle, {status: 200});
  } catch(err) {
    const { errors } = err;
    return NextResponse.json(errors, {status: 404});
  }
}
