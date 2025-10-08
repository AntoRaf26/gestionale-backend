import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },

  // 👇 ora è un array di servizi
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],

  // 👇 unico operatore assegnato
  operator: { type: mongoose.Schema.Types.ObjectId, ref: "Operator", required: true },

  // 🔹 orari
  start: { type: Date, required: true },
  end: { type: Date, required: true },

  // 🔹 durata totale dei servizi (es. 90 min)
  totalDuration: { type: Number },

  // 🔹 eventuali note aggiuntive
  notes: { type: String },

  // 🔹 colore assegnato all'operatore (es. nel calendario)
  color: { type: String, default: "#f06292" }
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;