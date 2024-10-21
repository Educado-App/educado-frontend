import React, { useState } from 'react';
import RejectModal from './RejectModal';
import ApproveModal from './ApproveModal';
import AuthServices from '../services/auth.services';
import useSWR from 'swr';

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userDetails: any; // Replace with the appropriate type
  token: string;
  applicationId: string;
  onHandleStatus: () => void;
  userApplication: any; // Replace with the appropriate type
  contentCreator: any; // Replace with the appropriate type
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ isOpen, onClose, userDetails, token, applicationId, onHandleStatus, userApplication, contentCreator }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);
  const [isDropdownOpen2, setIsDropdownOpen2] = useState(false);
  const [isDropdownOpen3, setIsDropdownOpen3] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);

  if (!isOpen) return null;

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleDropdown2 = () => {
    setIsDropdownOpen2(!isDropdownOpen2);
  };

  const toggleDropdown3 = () => {
    setIsDropdownOpen3(!isDropdownOpen3);
  };

  const handleReject = () => {
    setIsRejectModalOpen(true);
  };

  const closeRejectModal = () => {
    setIsRejectModalOpen(false);
  };

  const handleApprove = () => {
    setIsApproveModalOpen(true);
  };

  const closeApproveModal = () => {
    setIsApproveModalOpen(false);
  };

  return (
    <>
      {(!isRejectModalOpen && !isApproveModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-80" onClick={onClose}></div>
          <div
            className="bg-[#E7F3F6] p-6 rounded-lg flex flex-col z-50"
            style={{ width: '800px' }}
          >
            {/* Header section */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Perfil de usuário</h2>
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
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <dt className="text-[#166276] text-base font-bold font-['Lato']">Nome</dt>
                  <dd id="name" className="text-base font-['Montserrat'] text-gray-900 break-all">
                    {userDetails.firstName} {userDetails.lastName}
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className="text-[#166276] text-base font-bold font-['Lato']">Email</dt>
                  <dd id="email" className="text-base font-['Montserrat'] text-gray-900 break-all">
                    {userDetails.email}
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className="text-[#166276] text-base font-bold font-['Lato']">Status</dt>
                  <dd id="status" className="text-base font-['Montserrat'] text-gray-900 break-all">
                  {contentCreator ? (contentCreator.approved ? ("Aprovado") : contentCreator.rejected ? ("Recusado") : "Aguardando análise") : null}
                  </dd>
                </div>
              </div>
              <button
                onClick={toggleDropdown}
                className={`mt-4 ${isDropdownOpen ? 'bg-[#166276] text-white' : 'bg-white text-gray-900'} py-4 px-2 rounded-lg text-base font-base font-['Lato'] w-full flex items-center ${
                  isDropdownOpen ? 'rounded-b-none' : ''
                }`}
              >
                <svg
                  className={`w-4 h-4 ml-2 transform transition-transform ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
                <span className="ml-2">Motivações</span>
              </button>
              {isDropdownOpen && (
                <div className="p-4 bg-white rounded-b-lg shadow break-all">
                  <p className="text-base font-['Montserrat'] text-gray-900">{userApplication?.application?.motivation !== undefined ? userApplication.application.motivation : "No motivation provided"}</p>
                </div>
              )}
              <button
                onClick={toggleDropdown2}
                className={`mt-4 ${isDropdownOpen2 ? 'bg-[#166276] text-white' : 'bg-white text-gray-900'} py-4 px-2 rounded-lg text-base font-base font-['Lato'] w-full flex items-center ${
                  isDropdownOpen2 ? 'rounded-b-none' : ''
                }`}
              >
                <svg
                  className={`w-4 h-4 ml-2 transform transition-transform ${isDropdownOpen2 ? 'rotate-180' : 'rotate-0'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
                <span className="ml-2">Experiências acadêmicas</span>
              </button>
              {isDropdownOpen2 && (
                <div className="p-4 bg-white rounded-b-lg shadow break-all">
                  <p className="text-base font-['Montserrat'] text-gray-900">
                    Academic level: {userApplication?.application?.academicLevel !== undefined ? userApplication.application.academicLevel : "No academic level provided"}
                    <br />
                    Academic status: {userApplication?.application?.academicStatus !== undefined ? userApplication.application.academicStatus : "No academic status provided"}
                    <br />
                    Major: {userApplication?.application?.major !== undefined ? userApplication.application.major : "No major provided"}
                    <br />
                    Institution: {userApplication?.application?.institution !== undefined ? userApplication.application.institution : "No institution provided"}
                    <br />
                    Education start date: {userApplication?.application?.educationStartDate !== undefined ? userApplication.application.educationStartDate : "No education start date provided"}
                    <br />
                    Education end date: {userApplication?.application?.educationEndDate !== undefined ? userApplication.application.educationEndDate : "No education end date provided"}
                    </p>
                </div>
              )}
              <button
                onClick={toggleDropdown3}
                className={`mt-4 ${isDropdownOpen3 ? 'bg-[#166276] text-white' : 'bg-white text-gray-900'} py-4 px-2 rounded-lg text-base font-base font-['Lato'] w-full flex items-center ${
                  isDropdownOpen3 ? 'rounded-b-none' : ''
                }`}
              >
                <svg
                  className={`w-4 h-4 ml-2 transform transition-transform ${isDropdownOpen3 ? 'rotate-180' : 'rotate-0'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
                <span className="ml-2">Experiências profissionais</span>
              </button>
              {isDropdownOpen3 && (
                <div className="p-4 bg-white rounded-b-lg shadow break-all">
                  <p className="text-base font-['Montserrat'] text-gray-900">
                    Company: {userApplication?.application?.company !== undefined ? userApplication.application.company : "No company provided"}
                    <br />
                    Position: {userApplication?.application?.position !== undefined ? userApplication.application.position : "No position provided"}
                    <br />
                    Work activities: {userApplication?.application?.workActivities !== undefined ? userApplication.application.workActivities : "No work activities provided"}
                    <br />
                    Work start date: {userApplication?.application?.workStartDate !== undefined ? userApplication.application.workStartDate : "No work start date provided"}
                    <br />
                    Work end date: {userApplication?.application?.workEndDate !== undefined ? userApplication.application.workEndDate : "No work end date provided"}
                    </p>
                </div>
              )}
            </div>
            {/* Modal content ends */}

            {/* Footer with buttons */}
            <div className="flex justify-between mt-2">
              <button onClick={onClose} className="text-[#166276] rounded text-base font-base font-['Lato'] underline underline-offset-4">
                Cancelar
              </button>
              <div className="flex space-x-4">
                <button onClick={handleReject} className="bg-[#FE4949] hover:bg-[#E44040] text-white p-3 rounded-lg text-base font-base font-['Lato'] w-32">
                  Recusar
                </button>
                <button onClick={handleApprove} className="bg-[#49A04A] hover:bg-[#418A42] text-white p-3 rounded-lg text-base font-base font-['Lato'] w-32">
                  Aprovar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <RejectModal isOpen={isRejectModalOpen} onClose={closeRejectModal} userDetails={userDetails} applicationId={applicationId} onHandleStatus={onHandleStatus} />
      <ApproveModal isOpen={isApproveModalOpen} onClose={closeApproveModal} token={token} userDetails={userDetails} applicationId={applicationId} onHandleStatus={onHandleStatus} />
    </>
  );
};

export default UserDetailsModal;