import express from "express";
import Appointment from "../models/Appointment.js";
import Client from "../models/Client.js";
import Operator from "../models/Operator.js";
import Service from "../models/Service.js";

const router = express.Router();

/* =========================================================
   CREA NUOVI APPUNTAMENTI (uno per ogni servizio scelto)
========================================================= */
router.post("/", async (req, res) => {
  try {
    const { client, operator, services, start } = req.body;

    if (!client || !operator || !services || services.length === 0) {
      return res.status(400).json({ message: "Dati mancanti o servizi vuoti" });
    }

    // Ora di inizio del primo servizio
    let currentStart = new Date(start);
    const createdAppointments = [];

    for (const service of services) {
      // Calcolo fine servizio
      const end = new Date(currentStart.getTime() + service.duration * 60000);

      // Crea un appuntamento separato per ogni servizio
      const appointment = new Appointment({
        client,
        operator,
        services: [service], // un solo servizio per evento
        start: currentStart,
        end,
      });

      await appointment.save();
      createdAppointments.push(appointment);

      // L'appuntamento successivo parte dove finisce il precedente
      currentStart = end;
    }

    // ✅ Ritorna un JSON leggibile (array di appuntamenti)
    res.status(201).json(createdAppointments.map(a => a.toObject()));
  } catch (error) {
    console.error("❌ Errore creazione appuntamenti:", error);
    res.status(500).json({ message: error.message });
  }
});

/* =========================================================
   RESTITUISCE TUTTI GLI APPUNTAMENTI
========================================================= */
router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("client")
      .populate("operator")
      .populate("services");

    // Formattazione per il calendario (nome cliente + servizio)
    const formatted = appointments.map((a) => ({
      _id: a._id,
      client: a.client,
      operator: a.operator,
      services: a.services,
      start: a.start,
      end: a.end,
      title: `${a.client?.name || "Cliente"} - ${a.services?.[0]?.name || ""}`,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("❌ Errore GET /appointments:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
