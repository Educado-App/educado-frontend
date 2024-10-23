import axios from "axios";

// Backend URL from .env file (automatically injected) 
import { BACKEND_URL } from "../helpers/environment";


//import { Storage } from '@google-cloud/storage';


export interface StorageInterface {
    uploadFile: (bucketName: string, file: any, id: string) => void;
    downloadFile: (bucketName: string, id: string, file: any) => void; 
}

// Props interface for uploadFile function
type FileProps = {
    file: any,
    id: string | undefined,
    parentType: string
}
/**
 * Uploads a file to a bucket
 * @param {string} file - The local path to the file to upload 
 * @param {string} id - The id the file will be saved as in the bucket. Format: courseId/sectionsId/componentId/index or courseId/index
 * @param {string} pranetType - A single letter that represents the type of the parent component. Format: c for course, and  l for lecture
 * @returns {void}
*/
async function uploadFile({id, file, parentType: parentType}: FileProps) {

    if (!file || !id) {
        return;
    }
    axios.postForm(`${BACKEND_URL}/api/bucket/upload`, {
        fileName: id + "_"+ parentType,
        file: file
    })
}

const getFile = async (url: string, token: string) => {
    return await axios.get(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.data);
  };

const deleteFile = async (id: string | undefined, token: string) => {
    if (!id) {
        return;
    }
return await axios.delete(`${BACKEND_URL}/api/bucket/${id}`, { headers: { Authorization: `Bearer ${token}` } })
    .then((res) => res.data);
};

const StorageServices = Object.freeze({
    uploadFile,
    getFile,
    deleteFile
});

export default StorageServices;