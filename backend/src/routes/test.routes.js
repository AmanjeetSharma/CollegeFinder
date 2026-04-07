import express from "express";
import { generateTest, submitTest, getUserTests, getUserRecentTests } from "../controllers/test.controller.js";

const router = express.Router();

// GET /api/test/user/:userId/recent - get recent tests for a user
router.get("/user/:userId/recent", getUserRecentTests);
// GET /api/test/user/:userId - get all tests for a user
router.get("/user/:userId", getUserTests);
// POST /api/test/build
router.post("/build", generateTest);

// POST /api/test/submit
router.post("/submit", submitTest);

export default router;
