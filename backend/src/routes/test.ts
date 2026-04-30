import { Router } from "express";
import { resetStore } from "../store.js";

const router = Router();

router.post("/reset", (_req, res) => {
  resetStore();
  res.sendStatus(204);
});

export default router;
