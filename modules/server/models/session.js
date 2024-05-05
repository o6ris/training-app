import mongoose, { Schema } from "mongoose";

// const exerciseSchema = new Schema(
//   {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Exercise",
//     required: true,
//   },
//   { _id: false }
// );

// const muscleSchema = new Schema(
//   {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Muscle",
//     required: true,
//   },
//   { _id: false }
// );

const sessionSchema = new Schema({
  muscles: {
    type: [String],
    required: true,
  },
  exercises: {
    type: [String],
    required: true,
  },
  name: {
    type: String,
    maxlength: [60, "Session name cannot be more than 60 characters"],
    required: true,
  },
  color: {
    type: String,
  },
});

const Session =
  mongoose.models.Session || mongoose.model("Session", sessionSchema);

export default Session;
