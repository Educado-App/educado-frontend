import axios from "axios";

// Interfaces
import { Lecture } from "../interfaces/Lecture";

export const client = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  responseType: 'json',
  timeout: 30000,
});


// Send the info to lecture service
const addLecture = async ({title, description}: Lecture, token: string, sid: string) => {
  return await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/api/lectures/create/${sid}`,
    {
      title: title,
      description: description,
      
    }/*,
    { headers: { Authorization: `Bearer ${token}` } }*/
  )

};

// Send the info to lecture service
const saveLecture = async (props: any, token: string) => {
  const response = await client.put(
    `/api/lectures/${props.id}`,
    props,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return response.data
};


const LectureService = Object.freeze({ addLecture, saveLecture });

export default LectureService;
