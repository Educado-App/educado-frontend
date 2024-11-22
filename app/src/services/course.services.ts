import axios from "axios";

// Backend URL from enviroment
import { BACKEND_URL } from '../helpers/environment';
import { getUserInfo } from "../helpers/userInfo";

//interfaces
import { Course, FormattedCourse } from "../interfaces/Course"


/**
 * IN ALL METHODS THE TOKEN HAS BEEN COMMENTED OUT, SINCE WE DON'T HAVE A TOKEN YET
 */


const createCourse = async (newCourse: FormattedCourse, token: string) => {
  const { id: userId } = getUserInfo();
  try {
    const res = await axios.post(
      `${BACKEND_URL}/api/courses/create/new`,
      { course: newCourse, userId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
};

const updateCourse = async (updatedCourse: FormattedCourse, token: string) => {
  const courseId = updatedCourse.courseInfo._id;
  console.log("updatedCourse", updatedCourse);
  try {
    const res = await axios.post(
      `${BACKEND_URL}/api/courses/update/${courseId}`,
      { updatedCourse },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
}



/**
 * Get all courses
 * @param token The token of the user
 * @returns A list of all courses
 */
const getAllCourses = async (token: string) => {
  const { id } = getUserInfo();

  const res = await axios.get(`${BACKEND_URL}/api/courses/creator/${id}`, { headers: { Authorization: `Bearer ${token}`, token: token } });

  // Convert dates in course data to Date objects
  res.data.forEach((course: any) => {
    course.dateCreated = new Date(course.dateCreated);
    course.dateUpdated = new Date(course.dateUpdated);
  });

  return res.data;
};

/**
 * Get course detail
 * @param url The route to get the course detail
 * @returns The course detail
 */
const getCourseDetail = async (id: string, token: string) => {
  const res = await axios.get(`${BACKEND_URL}/api/courses/${id}`, { headers: { Authorization: `Bearer ${token}` } })

  return res.data;
};

// Get course categories - FROM LAST YEAR, NOT IMPLEMENTED, CATEGORIES ARE HARDCODED RN
const getCourseCategories = async (url: string, token: string) => {
  const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } })

  return res.data;
}

/**
 * Update a specific course
 * @param data the data of the course to be updated 
 * @param id The id of the course
 * @param token The token of the user
 * @returns Confirmation of the update
 */
const updateCourseDetail = async (data: Course, id: string | undefined, token: string) => {

  const res = await axios.patch(
    `${BACKEND_URL}/api/courses/${id}`,
    data,
    { headers: { Authorization: `Bearer ${token}` } }
  )

  return res.data;
}

const updateCourseSectionOrder = async (sections: Array<string>, id: string | undefined, token: string) => {
  const res = await axios.patch(
    `${BACKEND_URL}/api/courses/${id}/sections`,
    { sections },
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return res.data;
}

const updateCourseStatus = async (course_id: string | undefined, status: string, token: string) => {
  const res = await axios.patch(
    `${BACKEND_URL}/api/courses/${course_id}/updateStatus`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return res.data;
}


/**
 * Delete a specific course 
 * @param id the id of the course that will be deleted
 * @param token token of the user 
 * @returns Delete data
 */
const deleteCourse = async (id: string | undefined, token: string) => {
  return await axios.delete(
    `${BACKEND_URL}/api/courses/${id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

// Export all methods
const CourseServices = Object.freeze({
  createCourse,
  updateCourse,
  getAllCourses,
  getCourseDetail,
  getCourseCategories,
  updateCourseDetail,
  updateCourseStatus,
  updateCourseSectionOrder,
  deleteCourse
});

export default CourseServices;