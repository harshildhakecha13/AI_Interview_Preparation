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
  createdAt: { type: String },
  interviewType: { type: String, default: "Technical" },
  difficulty: { type: String, default: "Medium" },
  duration: { type: String, default: "20 min" },
  questionsCount: { type: Number, default: 5 },
  voiceEnabled: { type: Boolean, default: true },
  cameraEnabled: { type: Boolean, default: true },
  resumeUsed: { type: Boolean, default: false },
  jdUsed: { type: Boolean, default: false },
  overallScore: { type: Number, default: 0 },
  summaryReport: { type: mongoose.Schema.Types.Mixed, default: null }
}, { strict: false });
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
  createdAt: { type: String },
  strongPoints: [{ type: String }],
  couldImprove: [{ type: String }],
  idealAnswer: { type: String },
  communication: { type: mongoose.Schema.Types.Mixed }
}, { strict: false });
export const UserAnswer = getModel("UserAnswer", UserAnswerSchema);

// 5. Newsletter Schema
const NewsletterSchema = new mongoose.Schema({
  newName: { type: String },
  newEmail: { type: String },
  newMessage: { type: String },
  createdAt: { type: String }
});
export const Newsletter = getModel("Newsletter", NewsletterSchema);

// 6. User Profile Schema (Personalization & Onboarding)
const UserProfileSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, unique: true, lowercase: true },
  fullName: { type: String, default: "" },
  targetRole: { type: String, default: "Full Stack Developer" },
  experienceLevel: { type: String, default: "Mid-Level" },
  preferredInterviewType: { type: String, default: "Technical" },
  skills: [{ type: String }],
  targetCompanies: [{ type: String }],
  linkedIn: { type: String, default: "" },
  onboardingCompleted: { type: Boolean, default: false },
  readinessScore: { type: Number, default: 72 },
  updatedAt: { type: Date, default: Date.now }
});
export const UserProfile = getModel("UserProfile", UserProfileSchema);

// 7. Resume & AI Intelligence Schema
const ResumeSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, unique: true, lowercase: true },
  fileName: { type: String, default: "resume.pdf" },
  fileSize: { type: String, default: "" },
  rawText: { type: String, default: "" },
  personal: {
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    location: { type: String, default: "" }
  },
  professional: {
    summary: { type: String, default: "" },
    currentRole: { type: String, default: "" },
    totalExperience: { type: String, default: "" },
    previousCompanies: [{ type: String }],
    jobTitles: [{ type: String }]
  },
  skills: {
    languages: [{ type: String }],
    frameworks: [{ type: String }],
    databases: [{ type: String }],
    cloud: [{ type: String }],
    devops: [{ type: String }],
    tools: [{ type: String }]
  },
  experience: [{
    company: String,
    role: String,
    duration: String,
    responsibilities: [String],
    achievements: [String]
  }],
  projects: [{
    name: String,
    technologies: [String],
    description: String,
    responsibilities: String,
    results: String
  }],
  education: [{
    degree: String,
    institution: String,
    year: String
  }],
  certifications: [{ type: String }],
  achievements: [{ type: String }],
  insights: {
    strengths: [{ type: String }],
    weakAreas: [{ type: String }],
    importantTechnologies: [{ type: String }],
    relevantProjects: [{ type: String }],
    relevantExperience: [{ type: String }],
    interviewWorthyClaims: [{
      claim: String,
      warning: String
    }]
  },
  updatedAt: { type: Date, default: Date.now }
});
export const Resume = getModel("Resume", ResumeSchema);

// 8. Job Description Match Schema
const JobMatchSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, lowercase: true },
  jobTitle: { type: String, required: true },
  company: { type: String, default: "" },
  rawJD: { type: String, required: true },
  analysis: {
    requiredSkills: [{ type: String }],
    preferredSkills: [{ type: String }],
    experienceReq: { type: String, default: "" },
    responsibilities: [{ type: String }],
    technologies: [{ type: String }],
    domainKnowledge: [{ type: String }],
    seniority: { type: String, default: "Mid-Senior" }
  },
  match: {
    overallMatch: { type: Number, default: 75 },
    skillsMatch: { type: Number, default: 70 },
    experienceMatch: { type: Number, default: 80 },
    technologyMatch: { type: Number, default: 75 },
    responsibilityMatch: { type: Number, default: 75 },
    missingSkills: [{ type: String }],
    strongMatches: [{ type: String }],
    interviewTopics: [{ type: String }]
  },
  createdAt: { type: Date, default: Date.now }
});
export const JobMatch = getModel("JobMatch", JobMatchSchema);

// 9. Saved Questions Schema (Question Library)
const SavedQuestionSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, lowercase: true },
  question: { type: String, required: true },
  category: { type: String, default: "Technical" },
  difficulty: { type: String, default: "Medium" },
  technology: { type: String, default: "General" },
  idealAnswer: { type: String, default: "" },
  notes: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});
export const SavedQuestion = getModel("SavedQuestion", SavedQuestionSchema);
