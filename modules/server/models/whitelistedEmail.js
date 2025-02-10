import mongoose, { Schema } from "mongoose";

const whitelistedSchema = new Schema({
  email: {
    type: String,
    required: [true, "email is required"],
    trim: true,
    maxLength: [50, "Name must be lesser than 50 characters"],
  },
  name: {
    type: String,
    minLength: [2, "Name must be larger than 2 characters"],
    maxLength: [50, "Name must be lesser than 50 characters"],
  },
});

const Whitelisted =
  mongoose.models.Whitelisted ||
  mongoose.model("Whitelisted", whitelistedSchema, "whitelistedemails");

export default Whitelisted;
