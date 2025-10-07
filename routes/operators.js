import express from "express";
import Operator from "../models/Operator.js";

const router = express.Router();

// 📄 GET – Ottieni tutti gli operatori
router.get("/", async (req, res) => {
  try {
    const operators = await Operator.find();
    res.json(operators);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ➕ POST – Aggiungi un nuovo operatore
router.post("/", async (req, res) => {
  try {
    const newOperator = new Operator(req.body);
    await newOperator.save();
    res.status(201).json(newOperator);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✏️ PUT – Aggiorna un operatore esistente
router.put("/:id", async (req, res) => {
  try {
    const updatedOperator = await Operator.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // restituisce il documento aggiornato
    );
    res.json(updatedOperator);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ❌ DELETE – Elimina un operatore
router.delete("/:id", async (req, res) => {
  try {
    await Operator.findByIdAndDelete(req.params.id);
    res.json({ message: "Operatore eliminato" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
