import { generateFinanceQuery } from "../service/geminiLLMService.js";

// Controller for generating test questions using Gemini
export const generateTest = async (req, res, next) => {
  try {
    const { studentClass, interest } = req.body;
    if (!studentClass || !interest || (Array.isArray(interest) && interest.length === 0)) {
      return res.status(400).json({ error: "studentClass and at least one interest are required" });
    }
    // Pass both values as an object to the service
    const questions = await generateFinanceQuery({ studentClass, interest });
    res.status(200).json({ success: true, questions });
  } catch (error) {
    next(error);
  }
};
