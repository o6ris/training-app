import mongoose, { Schema } from "mongoose";

const exerciseSchema = new Schema({
  exercise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exercise",
    required: true,
  },
  reps: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
});

const sessionSchema = new Schema({
  date: {
    type: Date,
    default: Date.now(),
    required: true,
    trim: true,
  },
  training: {
    type: [exerciseSchema],
    required: true,
  },
  name: {
    type: String,
  },
});

const Session =
  mongoose.models.Session || mongoose.model("Session", sessionSchema);

export default Session;
