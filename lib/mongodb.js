import mongoose from "mongoose";

const connectDb = async () => {
  const uri = process.env.MONGODB_URI;

  try {
    mongoose.connect(uri)
  } catch (err) {
    console.error(err)
  }
}

export default connectDb;