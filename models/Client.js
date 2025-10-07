import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: String,
  notes: String,
  history: [
    {
      date: String,
      service: String,
    },
  ],
});

export default mongoose.model("Client", clientSchema);
