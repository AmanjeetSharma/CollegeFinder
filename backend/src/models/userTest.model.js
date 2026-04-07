import mongoose, { Schema } from "mongoose";



const testQuestionSchema = new Schema(
  {
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true },
    userAnswer: { type: String },
  },
  { _id: false }
);

const testSectionSchema = new Schema(
  {
    sectionName: { type: String, required: true },
    sectionScore: { type: Number, required: true },
    questions: [testQuestionSchema]
  },
  { _id: false }
);


const userTestSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    totalScore: { type: Number, required: true },
    sections: [testSectionSchema],
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model("UserTest", userTestSchema);
