import express from "express";
import Appointment from "../models/Appointment.js";

const router = express.Router();

// 📌 GET: tutti gli appuntamenti
router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find()
  .populate("client")
  .populate("operator")
  .populate("services");

const formatted = appointments.map(a => {
  // Se esiste solo "service" singolo, converti in array
  if (!a.services && a.service) {
    a.services = [a.service];
  }
  return a;
});

res.json(formatted);

  }
});

// 📌 POST: nuovo appuntamento
router.post("/", async (req, res) => {
  try {
    const newAppointment = new Appointment(req.body);
    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📌 PUT: aggiornamento appuntamento (es. drag & drop)
router.put("/:id", async (req, res) => {
  try {
    const updated = await Appointment.findByIdAndUpdate(
  req.params.id,
  req.body,
  { new: true }
)
  .populate("client")
  .populate("service")
  .populate("operator"); // ✅ popolamento dopo update

res.json(updated);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📌 DELETE: eliminazione appuntamento
router.delete("/:id", async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: "Appuntamento eliminato" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
