import express from "express";
import cors from "cors";
import taskRoutes from "./routes/tasks";
import tagRoutes from "./routes/tags";
import testRoutes from "./routes/test";

const app = express();
const PORT = Number(process.env.PORT ?? 3000);
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? "http://localhost:5173";

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/tasks", taskRoutes);
app.use("/tags", tagRoutes);
if (process.env.NODE_ENV === "test") {
  app.use("/test", testRoutes);
}

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
