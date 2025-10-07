import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// importa le rotte
import operatorRoutes from "./routes/operators.js";
import serviceRoutes from "./routes/services.js";
import clientRoutes from "./routes/clients.js";
import appointmentRoutes from "./routes/appointments.js";

dotenv.config(); // deve stare prima dell’uso di process.env

// crea l'app
const app = express();

// middleware globali
app.use(cors());
app.use(express.json());

// connessione a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connessione a MongoDB riuscita"))
  .catch((err) => console.error("❌ Errore MongoDB:", err));

// collega le rotte API (dopo aver creato app!)
app.use("/api/operators", operatorRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/appointments", appointmentRoutes);

// rotta di test
app.get("/", (req, res) => {
  res.send("Server del gestionale parrucchiera attivo 🚀");
});

// avvia server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server avviato su porta ${PORT}`));
