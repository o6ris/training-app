import mongoose, { Schema } from "mongoose";

const sessionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  exercises: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exercise",
      required: [true, "At least, select one exercise"],
    },
  ],
  name: {
    type: String,
    required: [true, "Name must contain more than 1 characters"],
  }
});

const Session =
  mongoose.models.Session || mongoose.model("Session", sessionSchema);

export default Session;
