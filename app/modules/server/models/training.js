import mongoose, { Schema } from "mongoose";

const trainingSchema = new Schema({
  profile_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  },
  date: {
    type: Date,
    required: [true, "Name is required"],
    trim: true,
  },
  training: new Schema({
    muscle_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Muscle",
      required: true,
    },
    exercices: new Schema({
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
    }),
  }),
});

const Training =
  mongoose.models.Training || mongoose.model("Training", trainingSchema);

export default Training;
