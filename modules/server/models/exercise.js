import mongoose, { Schema, SchemaType } from "mongoose";

const descriptionSchema = new Schema({
  steps: {
    type: String,
    required: [true, "Steps are required"],
    trim: true,
    minlength: [30, "Steps must be at least 30 characters long"],
  },
  benefits: {
    type: String,
    required: [true, "Benefits are required"],
    trim: true,
    minlength: [30, "Benefits must be at least 30 characters long"],
  },
  mistakes: {
    type: String,
    required: [true, "Mistakes are required"],
    trim: true,
    minlength: [30, "Mistakes must be at least 30 characters long"],
  },
});

const exerciseSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  muscle: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Muscle",
      required: [true, "At least, select one muscle"],
    },
  ],
  description: {
    type: descriptionSchema,
    // required: [true, "Description is required"],
  },
  image: {
    type: String,
  },
  tiny_image: {
    type: String,
  }
});

const Exercise =
  mongoose.models.Exercise || mongoose.model("Exercise", exerciseSchema);

export default Exercise;
