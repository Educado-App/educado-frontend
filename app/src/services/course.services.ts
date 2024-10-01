import axios from "axios";

// Backend URL from enviroment
import { BACKEND_URL } from '../helpers/environment';
import { getUserInfo } from "../helpers/userInfo";

//interfaces
import {Course} from "../interfaces/Course"


/**
 * IN ALL METHODS THE TOKEN HAS BEEN COMMENTED OUT, SINCE WE DON'T HAVE A TOKEN YET
 */


const createCourse = async (data: Course, token: string) => {
  return await axios.put(

    `${BACKEND_URL}/api/courses`,
    {
      title: data.title,
      description: data.description,
      category: data.category,
      difficulty: data.difficulty,
      creator: data.creator,
      status: data.status
    },
    { headers: { Authorization: `Bearer ${token}`, token: localStorage.getItem('token') || '' } }
  );

};


/**
 * Get all courses
 * @param token The token of the user
 * @returns A list of all courses
 */
const getAllCourses = async ( token: string) => {
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
const getCourseDetail = async (url: string, token: string) => {
  const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } })

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
  getAllCourses,
  getCourseDetail,
  getCourseCategories,
  updateCourseDetail,
  updateCourseSectionOrder,
  /*updateCoverImage,*/
  deleteCourse
});

export default CourseServices;