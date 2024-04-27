import mongoose, { Schema } from "mongoose";

const statsSchema = new Schema({
  date: {
    type: Date,
    default: Date.now(),
    required: true,
    trim: true,
  },
  exercise: {
    type: Schema.Types.ObjectId,
    ref: "Exercise",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rest_time: {
    type: Number,
    required: true,
  },
  training_time: {
    type: Number,
    required: true,
  },
  series: [
    {
      reps: {
        type: Number,
        required: true,
      },
      weight: {
        type: Number,
        required: true,
      },
    },
  ],
  one_rm: {
    type: Number,
    required: true,
  },
});

const Stats = mongoose.models.Stats || mongoose.model("Stats", statsSchema);

export default Stats;
