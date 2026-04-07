// Controller to get recent tests for a user
export const getUserRecentTests = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit, 10) || 3;
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }
    const tests = await UserTest.find({ userId }).sort({ createdAt: -1 }).limit(limit);
    res.status(200).json({ success: true, tests });
  } catch (error) {
    next(error);
  }
};
import UserTest from "../models/userTest.model.js";
import { generateFinanceQuery } from "../service/geminiLLMService.js";
// Controller to get all tests for a user (with questions and answers)
export const getUserTests = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }
    const tests = await UserTest.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, tests });
  } catch (error) {
    next(error);
  }
};

// Controller for submitting test answers, calculating score, and saving to DB
export const submitTest = async (req, res, next) => {
  try {
    const { userId, answers } = req.body; // answers: [{ sectionName, questions: [{ question, options, answer, userAnswer }] }]
    if (!userId || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: "userId and answers are required" });
    }

    let totalCorrect = 0;
    let totalQuestions = 0;

    const sections = answers.map(section => {
      let sectionCorrect = 0;
      // Each question should have: question, options, answer, userAnswer
      const questions = section.questions.map(q => {
        if (q.userAnswer === q.answer) sectionCorrect++;
        totalQuestions++;
        return {
          question: q.question,
          options: q.options,
          correctAnswer: q.answer,
          userAnswer: q.userAnswer || null
        };
      });
      totalCorrect += sectionCorrect;
      return {
        sectionName: section.sectionName,
        sectionScore: questions.length > 0 ? Math.round((sectionCorrect / questions.length) * 100) : 0,
        questions
      };
    });

    // Score out of 100 for the whole test
    const totalScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    // Save to DB
    const userTest = await UserTest.create({
      userId,
      totalScore,
      sections
    });

    res.status(200).json({ success: true, totalScore, sections, userTestId: userTest._id });
  } catch (error) {
    next(error);
  }
};

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
