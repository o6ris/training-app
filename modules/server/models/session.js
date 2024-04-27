import mongoose, { Schema } from "mongoose";

const exerciseSchema = new Schema({
  exercise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exercise",
    required: true,
  },
});

const sessionSchema = new Schema({
  training: {
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
