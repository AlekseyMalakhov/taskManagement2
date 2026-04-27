import express from "express";
import cors from "cors";
import taskRoutes from "./routes/tasks";
import tagRoutes from "./routes/tags";

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/tasks", taskRoutes);
app.use("/tags", tagRoutes);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
