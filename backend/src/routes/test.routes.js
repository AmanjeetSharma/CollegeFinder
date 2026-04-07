import express from "express";
import { generateTest } from "../controllers/test.controller.js";

const router = express.Router();

// POST /api/test/build
router.post("/build", generateTest);

export default router;
