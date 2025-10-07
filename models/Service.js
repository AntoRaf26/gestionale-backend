import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  duration: Number,
  price: Number,
  operators: [String], // id degli operatori abilitati
});

export default mongoose.model("Service", serviceSchema);
