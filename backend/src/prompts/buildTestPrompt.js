export const buildTestPrompt = (studentClass, interest) => {
    // If interest is an array, join as comma-separated string; else use as is
    const interestStr = Array.isArray(interest) ? interest.join(", ") : interest;
    return `You are an intelligent question generator.

Generate a test of 30 multiple choice questions (MCQs) in JSON format.

Requirements:
1. The test must have 5 sections:
   - Quantitative
   - Logical Reasoning
   - Verbal Ability
   - Creative Thinking
   - Technical

2. Each section must contain exactly 6 questions.

3. Questions must be dynamically generated based on:
   - Student Class: ${studentClass}
   - Area of Interest: ${interestStr}

4. Difficulty level should match the student's class.

5. Each question must:
   - Be unique and different every time (no repetition)
   - Be relevant to the student's interest where possible
   - Be clear and concise

6. Each question must have:
   - 4 options
   - 1 correct answer

7. Output format must be strictly JSON (no extra text).

JSON Structure:
{
  "sections": [
    {
      "section_name": "Quantitative",
      "questions": [
        {
          "question": "string",
          "options": ["A", "B", "C", "D"],
          "answer": "correct_option"
        }
      ]
    }
  ]
}

8. The "answer" must exactly match one of the options.

9. Shuffle questions and options randomly every time.

10. Do NOT repeat questions across sections.

11. Ensure JSON is valid and properly formatted.

12. Do NOT include explanations.

Generate now.`;
}