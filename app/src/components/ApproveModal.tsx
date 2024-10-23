import React, { useState } from 'react';
import AuthServices from '../services/auth.services';
import AdminServices from '../services/admin.services';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ApproveModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string
  userDetails: any;
  applicationId: string;
  onHandleStatus: () => void;
}

const ApproveModal: React.FC<ApproveModalProps> = ({ isOpen, onClose, token, userDetails, applicationId, onHandleStatus }) => {
  if (!isOpen) return null;

  const handleAccept = async () => {
    try {
      console.log("Approving application for user ID:", applicationId);
      await AuthServices.AcceptApplication(applicationId);
      AdminServices.changeUserRole(applicationId, token, 'creator');
      onClose(); // Close the modal after rejection
      onHandleStatus();
      toast.success("Application accepted!");
    } catch (error) {
      console.error("Failed to reject application:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-80" onClick={onClose}></div>
      <div
        className="bg-[#E7F3F6] p-6 rounded-lg flex flex-col z-50"
        style={{ width: '550px' }}
      >
        {/* Header section */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Aprovar criador de conteúdo</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        {/* Scrollable content */}
        <div className="overflow-y-auto mb-4" style={{ maxHeight: 'calc(80vh - 150px)' }}>
          Você está recusando o perfil de criador de conteúdo do seguinte usuário:
          <div className="grid grid-cols-2">
            <div className="flex flex-col bg-white p-4 rounded-l-lg mt-4 relative">
              <dt className="text-[#166276] text-base font-bold font-['Lato']">Nome</dt>
              <dd id="name" className="text-base font-['Montserrat'] text-gray-900 break-all">
            {userDetails.firstName} {userDetails.lastName}
              </dd>
              <style>{`
                .relative::after {
                content: '';
                position: absolute;
                right: 0;
                top: 20%; /* Adjust this value to control the start position of the border */
                height: 60%; /* Adjust this value to control the length of the border */
                width: 1px;
                background-color: #E7F3F6;
                }
            `}</style>
            </div>
            <div className="flex flex-col bg-white p-4 rounded-r-lg mt-4">
              <dt className="text-[#166276] text-base font-bold font-['Lato']">Email</dt>
              <dd id="email" className="text-base font-['Montserrat'] text-gray-900 break-all">
            {userDetails.email}
              </dd>
            </div>
          </div>
          <p className="mt-4">Essa ação não pode ser desfeita.</p>
        </div>
        {/* Modal content ends */}

        {/* Footer with buttons */}
        <div className="flex justify-between mt-auto">
          <button onClick={onClose} className="text-[#166276] rounded text-base font-base font-['Lato'] underline underline-offset-4">
            Voltar
          </button>
          <div className="flex space-x-4">
            <button className="bg-[#166276] hover:bg-[#145A68] text-white p-3 rounded-lg text-base font-base font-['Lato'] w-32" onClick={handleAccept}>
              Aprovar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApproveModal;