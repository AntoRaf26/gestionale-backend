import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
  operator: { type: mongoose.Schema.Types.ObjectId, ref: "Operator" },
  start: Date,
  end: Date,
  color: { type: String, default: "#f06292" } // ✅ colore operatore
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
