import mongoose, { Schema } from "mongoose";

const exerciseSchema = new Schema({
  exercise_id: {
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

const muscleSchema = new Schema({
  muscle_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Muscle",
    required: true,
  },
  exercises: [exerciseSchema],
});

const trainingSchema = new Schema({
  profile_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
    required: true,
    trim: true,
  },
  training: [muscleSchema],
});

const Training =
  mongoose.models.Training || mongoose.model("Training", trainingSchema);

export default Training;
