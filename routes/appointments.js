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

    // 🔹 Rende i dati "piatti" e JSON-friendly
    const formatted = appointments.map((a) => ({
      _id: a._id,
      client: a.client,
      operator: a.operator,
      services: a.services,
      start: a.start,
      end: a.end,
      title: `${a.client?.name || "Cliente"} - ${a.services?.[0]?.name || ""}`,
    }));

    res.status(200).json(formatted.flat());
  } catch (err) {
    console.error("Errore GET /appointments:", err);
    res.status(500).json({ error: err.message });
  }
});


// 📌 POST: nuovo appuntamento
router.post("/", async (req, res) => {
  try {
    const { client, operator, services, start } = req.body;

    if (!Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ message: "Nessun servizio selezionato" });
    }

    // Calcolo eventi distinti per ogni servizio
    let currentStart = new Date(start);
    const createdAppointments = [];

    for (const service of services) {
      const end = new Date(currentStart.getTime() + service.duration * 60000);

      const appointment = new Appointment({
        client,
        operator,
        services: [service], // singolo servizio
        start: currentStart,
        end,
      });

      await appointment.save();
      createdAppointments.push(appointment);

      // Aggiorna l'orario di inizio per il prossimo servizio
      currentStart = end;
    }

    res.status(201).json(createdAppointments);
  } catch (error) {
    console.error("❌ Errore creazione appuntamenti multipli:", error);
    res.status(400).json({ message: error.message });
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
