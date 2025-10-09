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

    // 🔹 Compatibilità con vecchi record (service singolo)
    const formatted = appointments.map((a) => {
      if (!a.services && a.service) {
        a.services = [a.service];
      }
      return a;
    });

    res.json(formatted);
  } catch (err) {
    console.error("Errore GET /appointments:", err);
    res.status(500).json({ error: err.message });
  }
});

// 📌 POST: nuovo appuntamento
router.post("/", async (req, res) => {
  try {
    const { client, services, operator, start, end, notes, totalDuration } =
      req.body;

    const newAppointment = new Appointment({
      client,
      services,
      operator,
      start,
      end,
      totalDuration,
      notes,
    });

    await newAppointment.save();
    const populated = await Appointment.findById(newAppointment._id)
      .populate("client")
      .populate("operator")
      .populate("services");

    res.status(201).json(populated);
  } catch (err) {
    console.error("Errore POST /appointments:", err);
    res.status(400).json({ error: err.message });
  }
});

// 📌 PUT: aggiornamento appuntamento (es. drag & drop)
router.put("/:id", async (req, res) => {
  try {
    const updated = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .populate("client")
      .populate("operator")
      .populate("services");

    res.json(updated);
  } catch (err) {
    console.error("Errore PUT /appointments:", err);
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
