import express from "express";
import Client from "../models/Client.js";

const router = express.Router();

// 📄 GET - tutti i clienti
router.get("/", async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ➕ POST - aggiungi un cliente
router.post("/", async (req, res) => {
  try {
    const client = new Client(req.body);
    await client.save();
    res.status(201).json(client);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✏️ PUT - aggiorna cliente
router.put("/:id", async (req, res) => {
  try {
    const updated = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ❌ DELETE - elimina cliente
router.delete("/:id", async (req, res) => {
  try {
    await Client.findByIdAndDelete(req.params.id);
    res.json({ message: "Cliente eliminato" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
