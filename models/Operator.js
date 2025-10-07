import mongoose from "mongoose";

const operatorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: String,
  active: { type: Boolean, default: true },
});

export default mongoose.model("Operator", operatorSchema);
