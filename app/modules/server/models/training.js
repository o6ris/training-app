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

const muscleSchema = new Schema({
  muscle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Muscle",
    required: true,
  },
  exercises: {
    type: [exerciseSchema],
    required: true,
  },
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
  training: {
    type: [muscleSchema],
    required: true,
  },
});

const Training =
  mongoose.models.Training || mongoose.model("Training", trainingSchema);

export default Training;
