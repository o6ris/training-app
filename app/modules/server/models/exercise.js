import mongoose, { Schema } from "mongoose";

const exerciseSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    muscle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Muscle',
      required: true,
    }
  }
);

const Exercise = mongoose.models.Exercise || mongoose.model("Exercise", exerciseSchema)

export default Exercise;
