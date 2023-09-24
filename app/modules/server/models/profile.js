import mongoose, { Schema } from "mongoose";

const profileSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minLength: [2, "Name must be larger than 2 characters"],
      maxLength: [50, "Name must be lesser than 50 characters"],
    },
    sex: {
      type: String,
      required: true,
      default: "female",
      enum: ['female', 'male'],
    },
    age: {
      type: Number,
      required: true,
      min: [10, "Too young! "],
    },
    size: {
      type: Number,
      required: true,
      min: [50, "Too short! "],
    },
    weight: {
      required: true,
      type: Number,
    },
  }
);

const Profile = mongoose.models.Profile || mongoose.model("Profile", profileSchema)

export default Profile;
