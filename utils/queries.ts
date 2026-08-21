import { cache } from "react";
import dbConnect from "./db";
import { UserProgress, Course } from "./schema";
import { auth } from "./auth";

// Fetches user progress for the authenticated user
export const getUserProgress = cache(async () => {
  try {
    await dbConnect();
    const { userId } = await auth();

    if (!userId) {
      return null; // Return null if no userId is found
    }

    // Query userProgress from MongoDB
    const progress = await UserProgress.findOne({ userId }).lean() as any;
    if (!progress) {
      return null;
    }

    // Populate active course
    if (progress.activeCourseId) {
      const activeCourse = await Course.findOne({ id: progress.activeCourseId }).lean();
      progress.activeCourse = activeCourse;
    }

    return progress;
  } catch (error) {
    console.error("Error fetching user progress:", error);
    return null;
  }
});

// Fetches all courses
export const getCourses = cache(async () => {
  try {
    await dbConnect();
    let data = await Course.find({}).lean();
    
    // Auto-seed default courses if the collection is empty
    if (data.length === 0) {
      const defaultCourses = [
        { id: 1, title: "Spanish", imageSrc: "/es.svg" },
        { id: 2, title: "French", imageSrc: "/fr.svg" },
        { id: 3, title: "German", imageSrc: "/de.svg" },
        { id: 4, title: "Italian", imageSrc: "/it.svg" },
      ];
      await Course.insertMany(defaultCourses);
      data = await Course.find({}).lean();
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
});

export const getCourseById = cache(async (courseId: number) => {
  try {
    await dbConnect();
    const data = await Course.findOne({ id: courseId }).lean();
    return data;
  } catch (error) {
    console.error("Error fetching Courses By Id:", error);
    return null;
  }
});
