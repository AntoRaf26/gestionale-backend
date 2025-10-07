import express from "express";
import Service from "../models/Service.js";

const router = express.Router();

// 📄 GET - tutti i servizi
router.get("/", async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ➕ POST - aggiungi un nuovo servizio
router.post("/", async (req, res) => {
  try {
    const newService = new Service(req.body);
    await newService.save();
    res.status(201).json(newService);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✏️ PUT - aggiorna un servizio esistente
router.put("/:id", async (req, res) => {
  try {
    const updated = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ❌ DELETE - elimina un servizio
router.delete("/:id", async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "Servizio eliminato" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
