import mongoose, { Schema } from "mongoose";

const muscleSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    enum: ["legs", "glutes", "back", "abs", "pectorals", "arms", "shoulders"],
  },
  image: {
    type: String,
  },
});

const Muscle = mongoose.models.Muscle || mongoose.model("Muscle", muscleSchema);

export default Muscle;
