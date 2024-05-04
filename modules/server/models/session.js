import mongoose, { Schema } from "mongoose";

const exerciseSchema = new Schema({
  exercise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exercise",
    required: true,
  },
});

const muscleSchema = new Schema({
  muscle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Muscle",
    required: true,
  },
});

const sessionSchema = new Schema({
  muscles: {
    type: [muscleSchema],
    required: true,
  },
  exercises: {
    type: [exerciseSchema],
    required: true,
  },
  name: {
    type: String,
  },
  color: {
    type: String,
  },
});

const Session =
  mongoose.models.Session || mongoose.model("Session", sessionSchema);

export default Session;
