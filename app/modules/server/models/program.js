import mongoose, { Schema } from "mongoose";

const programSchema = new Schema({
  sessions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    }
  ],
  name: {
    type: String,
    required: true,
  },
  frequency: {
    type: Number,
    required: true,
  },
  start_date: {
    type: Date,
    required: true,
  },
  period: {
    type: Number,
    required: true
  },
  training_days: [
    {
      day: {
        type: Number,
        enum: [
          1,
          2,
          3,
          4,
          5,
          6,
          7,
        ],
        required: true,
      },
      session: {
        type: Schema.Types.ObjectId,
        ref: "Session",
      },
    },
  ],
});

const Program =
  mongoose.models.Program || mongoose.model("Program", programSchema);

export default Program;
