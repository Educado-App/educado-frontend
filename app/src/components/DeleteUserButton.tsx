import React, { useState } from 'react';
import { getUserToken } from '../helpers/userInfo';
import AdminServices from '../services/admin.services';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface DeleteUserButtonProps {
  applicationId: string;
  onDelete: () => void;
}

const DeleteUserButton: React.FC<DeleteUserButtonProps> = ({ applicationId, onDelete }) => {
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async () => {
    try {
      console.log("Deleting user with ID:", applicationId);
      const token = getUserToken();
      if (!token) {
        console.error('No token found');
        return;
      }
      console.log("Token:", token); // Log the token to verify it
      await AdminServices.deleteUser(applicationId, token);
      toast.success("User deleted successfully!");
      onDelete();
      setShowModal(false); // Close the modal after deletion
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("Failed to delete user.");
    }
  };

  const handleClick = () => {
    setShowModal(true); // Show the confirmation modal
  };

  const handleCancel = () => {
    setShowModal(false); // Hide the modal if user cancels
  };

  return (
    <>
      <div
        key={applicationId}
        id="deleteUser"
        className="flex items-center justify-center p-4 -ml-2 mr-6 bg-[#166276] rounded-full font-semibold text-base text-white cursor-pointer hover:bg-[#145a63]"
        onClick={handleClick}
      >
        <svg
          className="shrink-0 size-3.5"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="white"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            fillRule="evenodd"
            d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h3 className="text-lg font-bold mb-4">Are you sure you want to delete this user?</h3>
            <div className="flex justify-end">
              <button
                onClick={handleCancel}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteUserButton;