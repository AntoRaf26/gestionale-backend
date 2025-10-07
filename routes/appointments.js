import express from "express";
import Appointment from "../models/Appointment.js";

const router = express.Router();

// 📌 GET: tutti gli appuntamenti
router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("client")
      .populate("service")
      .populate("operator");
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
