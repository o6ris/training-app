import { Types } from "mongoose";

export default function checkId(id) {
  return Types.ObjectId.isValid(id);
}
