import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "email is required"],
    trim: true,
    maxLength: [50, "Name must be lesser than 50 characters"],
    unique: true,
  },
  password: {
    type: String,
  },
  name: {
    type: String,
    minLength: [2, "Name must be larger than 2 characters"],
    maxLength: [50, "Name must be lesser than 50 characters"],
  },
  sex: {
    type: String,
    default: "female",
    enum: ["female", "male"],
  },
  age: {
    type: Number,
    min: [16, "Too young! "],
  },
  height: {
    type: Number,
  },
  weight: {
    type: Number,
  },
  policy: {
    type: Boolean,
    default: false,
  },
  newsletter: {
    type: Boolean,
    default: false,
  },
  first_connexion: {
    type: Boolean,
    default: true,
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
