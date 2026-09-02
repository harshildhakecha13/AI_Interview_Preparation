import mongoose from "mongoose";

// Helper to check and define model to avoid compile errors on hot reload
const getModel = (name, schema) => {
  return mongoose.models[name] || mongoose.model(name, schema);
};

// 1. User Account Schema (Custom Authentication)
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
export const User = getModel("User", UserSchema);

// 2. Mock Interview Schema
const MockInterviewSchema = new mongoose.Schema({
  mockId: { type: String, required: true, unique: true },
  jsonMockResp: { type: String, required: true },
  jobPosition: { type: String, required: true },
  jobDesc: { type: String, required: true },
  jobExperience: { type: String, required: true },
  createdBy: { type: String, required: true }, // User email
  createdAt: { type: String }
});
export const MockInterview = getModel("MockInterview", MockInterviewSchema);

// 3. Question Schema
const QuestionSchema = new mongoose.Schema({
  mockId: { type: String, required: true, unique: true },
  MockQuestionJsonResp: { type: String, required: true },
  jobPosition: { type: String, required: true },
  jobDesc: { type: String, required: true },
  jobExperience: { type: String, required: true },
  typeQuestion: { type: String, required: true },
  company: { type: String, required: true },
  createdBy: { type: String, required: true }, // User email
  createdAt: { type: String }
});
export const Question = getModel("Question", QuestionSchema);

// 4. User Answer & AI Feedback Schema
const UserAnswerSchema = new mongoose.Schema({
  mockIdRef: { type: String, required: true },
  question: { type: String, required: true },
  correctAns: { type: String },
  userAns: { type: String },
  feedback: { type: String },
  rating: { type: String },
  userEmail: { type: String },
  createdAt: { type: String }
});
export const UserAnswer = getModel("UserAnswer", UserAnswerSchema);

// 5. Newsletter Schema
const NewsletterSchema = new mongoose.Schema({
  newName: { type: String },
  newEmail: { type: String },
  newMessage: { type: String },
  createdAt: { type: String }
});
export const Newsletter = getModel("Newsletter", NewsletterSchema);
