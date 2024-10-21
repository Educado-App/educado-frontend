import { useState } from "react";
import useSWR from "swr";
import {
  Institution,
  institutionService,
} from "../../services/Institution.services";
import Loading from "../general/Loading";
import {
  GoArrowLeft,
  GoArrowRight,
  GoChevronLeft,
  GoChevronRight,
} from "react-icons/go";
import { MdDelete, MdCreate } from "react-icons/md";
import { Link } from "react-router-dom";
import GenericModalComponent from "../GenericModalComponent";
import { getUserToken } from "../../helpers/userInfo";
import { toast } from "react-toastify";

export const InstitutionsTableAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data: institutionsResponse, mutate } = useSWR(
    "api/user-info",
    institutionService.getInstitutions
  );

  if (typeof institutionsResponse === "undefined") return <Loading />;

  const filteredData = institutionsResponse.data.filter((institution) => {
    if (searchTerm === "") return institution;
    if (
      institution.institutionName
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
      return institution;
    if (institution.domain.toLowerCase().includes(searchTerm.toLowerCase()))
      return institution;
    if (
      institution.secondaryDomain
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
      return institution;
  });

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const startItem = (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, filteredData.length);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  const UpdateButton = ({ institution }: { institution: Institution }) => {
    const [showModal, setShowModal] = useState(false);
    console.log(showModal, "update");

    const [nameInput, setNameInput] = useState("");
    const [domainInput, setDomainInput] = useState("");
    const [secondaryDomainInput, setSecondaryDomainInput] = useState("");

    const handleConfirm = async () => {
      try {
        if (nameInput === "" || domainInput === "")
          await institutionService.updateInstitution(
            institution._id!,
            getUserToken(),
            {
              institutionName: nameInput,
              domain: domainInput,
              secondaryDomain: secondaryDomainInput,
            }
          );
        mutate();
      } catch (err) {
        toast.error(err as string);
        console.error(err);
      }
    };

    const handleClose = () => {
      setNameInput("");
      setDomainInput("");
      setSecondaryDomainInput("");

      setShowModal(false);
    };

    return (
      <>
        <button onClick={() => setShowModal(true)}>
          <MdCreate />
        </button>

        {showModal && (
          <GenericModalComponent
            onConfirm={handleConfirm}
            onClose={handleClose}
            isVisible={showModal}
            confirmBtnText="Update"
            title="Update Instituições"
            contentText=""
            children={
              <form>
                <div className="flex-col">
                  <input
                    type="text"
                    name="institution-name"
                    placeholder="Institution Name"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                  />
                  <input
                    type="text"
                    name="domain"
                    placeholder="Domain"
                    value={domainInput}
                    onChange={(e) => setDomainInput(e.target.value)}
                  />
                  <input
                    type="text"
                    name="secondary-domain"
                    placeholder="Secondary domain"
                    value={secondaryDomainInput}
                    onChange={(e) => setSecondaryDomainInput(e.target.value)}
                  />
                </div>
              </form>
            }
          />
        )}
      </>
    );
  };

  const DeleteButton = ({ institutionId }: { institutionId: string }) => {
    const [showModal, setShowModal] = useState(false);
    console.log(showModal);

    const handleConfirm = async () => {
      try {
        await institutionService.deleteInstitution(
          institutionId,
          getUserToken()
        );
        mutate();
      } catch (err) {
        toast.error(err as string);
        console.error(err);
      }
    };

    return (
      <>
        <button onClick={() => setShowModal(true)}>
          <MdDelete />
        </button>
        {showModal && (
          <GenericModalComponent
            onConfirm={handleConfirm}
            onClose={() => setShowModal(false)}
            isVisible={showModal}
            confirmBtnText="Deletar"
            title="Deletando usuário"
            contentText="Você tem certeza de que deseja excluir este Instituições?"
          />
        )}
      </>
    );
  };

  return (
    <div className="w-full flex flex-row space-x-2 px-12 py-10">
      <div className="inline-block min-w-full shadow overflow-hidden rounded-xl bg-white">
        <div className="flex flex-row no-wrap"></div>

        <form className="flex flex-col md:flex-row w-3/4 md:w-full max-w-full md:space-x-4 space-y-3 md:space-y-0 justify-end p-6 -mt-4">
          <select className="block bg-white min-w-[175px] flex-grow-0 border border-slate-300 rounded-md py-2 pr-3 shadow-sm focus:outline-none hover:bg-white focus:border-sky-500 focus:ring-1 sm:text-sm">
            <option value="option1">Mais recentes</option>
          </select>
          <div className="relative min-w-[225px] flex-grow-0">
            <input
              className="placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pr-3 shadow-sm focus:outline-none hover:bg-white focus:border-sky-500 focus:ring-1 sm:text-sm"
              type="text"
              id="search-term"
              placeholder="Buscar usuário"
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <svg
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <Link to={"/educado-admin/new-institution"}>
            <button className="btn font-semibold font-['Montserrat'] bg-[#166276] text-white">
              Adicionar
            </button>
          </Link>
        </form>

        <table className="w-[96%] leading-normal mx-auto">
          <thead>
            <tr className="bg-white border-b-4 border-[#166276] text-[#166276] text-left text-base font-base font-['Lato']]">
              <th scope="col" className="p-7" style={{ width: "25%" }}>
                Instituições
              </th>
              <th scope="col" className="p-5" style={{ width: "25%" }}>
                Domínio
              </th>
              <th scope="col" className="p-5" style={{ width: "25%" }}>
                Domínio secundário
              </th>
              <th scope="col" className="p-5" style={{ width: "10%" }}></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((institution, key: number) => {
              return (
                <tr
                  key={key}
                  className="px-5 py-5 border-b border-gray-300 bg-white text-base font-['Montserrat']"
                >
                  <td>
                    <span>{institution.institutionName}</span>
                  </td>
                  <td>
                    <div className="flex items-center">
                      <div className="ml-3">
                        <p
                          className="text-gray-900 whitespace-no-wrap"
                          id="name"
                          style={{ wordBreak: "break-word" }}
                        >
                          {institution.domain}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td style={{ wordBreak: "break-word" }}>
                    <p className="text-gray-900 whitespace-no-wrap" id="email">
                      {institution.secondaryDomain}
                    </p>
                  </td>
                  <td>
                    <div className="flex items-center p-4">
                      <UpdateButton institution={institution} />
                      <DeleteButton institutionId={institution._id!} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="px-5 bg-white py-5 flex flex-row xs:flex-row items-center xs:justify-between justify-end">
          <div className="flex items-center">
            <span className="text-gray-600">Rows per page:</span>
            <div className="relative">
              <select
                className="appearance-none bg-none border-none text-gray-600 focus:ring-0 cursor-pointer"
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
              </select>
              <svg
                className="absolute right-6 top-1/2 transform -translate-y-1/2 h-4 w-3.5 text-gray-600 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            <span className="text-gray-600 mx-2 ml-8">
              {startItem} - {endItem} of {filteredData.length}
            </span>
          </div>
          <div className="flex items-center ml-8">
            <button
              type="button"
              className={`w-full p-3 text-base ${
                currentPage === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 bg-white hover:bg-gray-100 cursor-pointer"
              }`}
              onClick={handleFirstPage}
            >
              <GoArrowLeft />
            </button>
            <button
              type="button"
              className={`w-full p-3 text-base ${
                currentPage === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 bg-white hover:bg-gray-100 cursor-pointer"
              }`}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <GoChevronLeft />
            </button>
            <button
              type="button"
              className={`w-full p-3 text-base ${
                currentPage === totalPages
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 bg-white hover:bg-gray-100 cursor-pointer"
              }`}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <GoChevronRight />
            </button>
            <button
              type="button"
              className={`w-full p-3 text-base ${
                currentPage === totalPages
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 bg-white hover:bg-gray-100 cursor-pointer"
              }`}
              onClick={handleLastPage}
            >
              <GoArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
