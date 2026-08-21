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

// 5. Course Schema (Language Prep Courses)
const CourseSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true }, // custom serial ID
  title: { type: String, required: true },
  imageSrc: { type: String, required: true }
});
export const Course = getModel("Course", CourseSchema);

// 6. Unit Schema
const UnitSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  courseId: { type: Number, required: true },
  order: { type: Number, required: true }
});
export const Unit = getModel("Unit", UnitSchema);

// 7. Lesson Schema
const LessonSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  unitId: { type: Number, required: true },
  order: { type: Number, required: true }
});
export const Lesson = getModel("Lesson", LessonSchema);

// 8. Challenge Schema
const ChallengeSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  lessonId: { type: Number, required: true },
  type: { type: String, required: true, enum: ["SELECT", "ASSIST"] },
  duoQuestion: { type: String, required: true },
  order: { type: Number, required: true }
});
export const Challenge = getModel("Challenge", ChallengeSchema);

// 9. Challenge Options Schema
const ChallengeOptionSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  challengeId: { type: Number, required: true },
  text: { type: String, required: true },
  correct: { type: Boolean, required: true },
  imageSrc: { type: String },
  audioSrc: { type: String }
});
export const ChallengeOption = getModel("ChallengeOption", ChallengeOptionSchema);

// 10. Challenge Progress Schema
const ChallengeProgressSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  challengeId: { type: Number, required: true },
  completed: { type: Boolean, default: false }
});
export const ChallengeProgress = getModel("ChallengeProgress", ChallengeProgressSchema);

// 11. User Progress Schema
const UserProgressSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  userName: { type: String, default: "User" },
  userImageSrc: { type: String, default: "/logo.svg" },
  activeCourseId: { type: Number },
  hearts: { type: Number, default: 5 },
  points: { type: Number, default: 0 }
});
export const UserProgress = getModel("UserProgress", UserProgressSchema);

// 12. Newsletter Schema
const NewsletterSchema = new mongoose.Schema({
  newName: { type: String },
  newEmail: { type: String },
  newMessage: { type: String },
  createdAt: { type: String }
});
export const Newsletter = getModel("Newsletter", NewsletterSchema);
