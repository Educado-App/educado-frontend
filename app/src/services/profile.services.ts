//imports
import axios from "axios";
import { BACKEND_URL } from '../helpers/environment';


//Upload image request
const postImage = async (formData: any) => {
  return await axios.post(
      `${BACKEND_URL}/api/bucket/upload`,
      formData
    );
}

//---Get requests---//
// Send get request to personal information form
const getUserFormOne = async (userID: any) => {
  return await axios.get(
    `${BACKEND_URL}/api/users/fetch/${userID}`
  );
}

// Send get request to academic experience form
const getUserFormTwo = async (userID: any) => {
  return await axios.get(
    `${BACKEND_URL}/api/users/get-education/${userID}`
  );
}
// Send get request to professional experience form
const getUserFormThree = async (userID: any) => {
  return await axios.get(
    `${BACKEND_URL}/api/users/get-experience/${userID}`
  );
}

//---Delete requests---//
//Delete additional academic forms 
const deleteEducationForm = async (_id: any) => {
  return await axios.delete(
    `${BACKEND_URL}/api/users/delete-education/${_id}`
  );
}

//Delete additional professional forms
const deleteExperienceForm = async (_id: any) => {
  return await axios.delete(
    `${BACKEND_URL}/api/users/delete-experience/${_id}`
  );
}

//---Update requests---//
//Update personal form
const putFormOne = async (formDataToSend: any) => {
  return await axios.put(
    `${BACKEND_URL}/api/users/update-personal/`,
    formDataToSend)
}

//Update academic form
const putFormTwo = async (data: any) => {
  return await axios.put(
    `${BACKEND_URL}/api/users/add-education`, data)
}

//Update professional form
const putFormThree = async (data: any) => {
  return await axios.put(`${BACKEND_URL}/api/users/add-experience`, data);
};



const ProfileServices = Object.freeze({
  getUserFormThree,
  getUserFormTwo,
  getUserFormOne, 
  deleteExperienceForm,
  deleteEducationForm, 
  putFormThree,
  putFormTwo,
  putFormOne,
  postImage,
});

export default ProfileServices;