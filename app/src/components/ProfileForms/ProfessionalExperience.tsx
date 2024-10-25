// Imports
import { Icon } from "@mdi/react";
import React, { Fragment } from "react";
import { mdiAlertCircleOutline, mdiDelete } from "@mdi/js";

// Export UI content and structure
export default function ProfessionalExperienceForm({
  index,
  experienceFormData,
  handleExperienceInputChange,
  experienceErrors,
  addNewExperienceForm,
  handleExperienceDelete,
  handleCountExperience,
  handleCheckboxChange,
}: {
  index: number;
  experienceFormData: Array<{
    company?: string;
    jobTitle?: string;
    workStartDate?: string;
    workEndDate?: string;
    description?: string;
    isCurrentJob?: boolean;
    _id?: string | number | null;
  }>;
  handleExperienceInputChange: (
    event: { target: { name: string; value: string } },
    index: number,
    isCurrentJob: boolean | undefined
  ) => void;
  experienceErrors: { [key: string]: string }[];
  addNewExperienceForm: (index: number) => void;
  handleExperienceDelete: (index: number, id: string) => void;
  handleCountExperience: (index: number) => number;
  handleCheckboxChange: (index: number) => void;
  errors: unknown;
}) {
  
  function displayInvalidDateFormatErrMsg(strValue: string, errorMsg: string) {
    if (strValue !== "") {
      return (
        <p
          className="flex items-center mt-1 ml-4 text-warning text-sm font-['Montserrat']"
          role="alert"
        >
          {errorMsg}
        </p>
      );
    }
    return null;
  }

  return (
    <Fragment>
      <div key={index}>
        {" "}
        <div
          /* Styling based on conditions */
          className={`border border-primary p-4 text-left bg-white shadow-xl ${
            (experienceFormData.length === 1 && index === 0) ||
            (experienceFormData.length > 1 &&
              index === experienceFormData.length - 1)
              ? "rounded-b-lg"
              : ""
          }`}
        >
          <label className="text-[#A1ACB2] font-['Montserrat']">
            Experiências profissionais {index + 1}
          </label>{" "}
          
          <div className="grid grid-cols-2 gap-3">
            
            {/* Company */}
            <div className="flex flex-col ">
              <label htmlFor="firstName" className="font-['Montserrat']">
                Empresa:
                <span className="p-2 text-[#FF4949] text-sm font-normal font-['Montserrat']">
                  *
                </span>
              </label>
              
              <input
                className="bg-[#E4F2F5] rounded-lg border-none"
                id={`company-${index}`}
                placeholder="Empresa"
                type="text"
                name="company"
                value={experienceFormData[index]?.company || ""}
                required={true}
                onChange={(value) => {
                  handleExperienceInputChange(value, index, experienceFormData[index]?.isCurrentJob);
                }}
              ></input>
            </div>
              
            {/* Job Title */}
            <div className="flex flex-col ">
              <label htmlFor="status" className="font-['Montserrat']">
                Cargo
                <span className="p-2 text-[#FF4949] text-sm font-normal font-['Montserrat']">
                  *
                </span>
              </label>
              
              <input
                className="bg-[#E4F2F5] rounded-lg border-none"
                id={`jobTitle-${index}`}
                placeholder="Cargo"
                type="text"
                name="jobTitle"
                value={experienceFormData[index]?.jobTitle || ""}
                required={true}
                onChange={(value) => {
                  handleExperienceInputChange(value, index, experienceFormData[index]?.isCurrentJob);
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            
            {/* Work start date */}
            <div className="flex flex-col ">
              <label htmlFor="firstName" className="font-['Montserrat']">
                Início:
                <span className="p-2 text-[#FF4949] text-sm font-normal font-['Montserrat']">
                  *
                </span>
              </label>
              
              <input
                className="bg-[#E4F2F5] rounded-lg border-none"
                id={`workStartDate-${index}`}
                placeholder="Mês/Ano"
                type="text"
                maxLength={7}
                name="workStartDate"
                value={experienceFormData[index]?.workStartDate || ""}
                required={true}
                onChange={(value) => {
                  handleExperienceInputChange(value, index, experienceFormData[index]?.isCurrentJob);
                }}
              />

              {/* Display invalid date input error message */}
              {displayInvalidDateFormatErrMsg(experienceFormData[index]?.workStartDate, experienceErrors[index].workStartDate)}

            </div>

            {/* Work end date */}
            <div className="flex flex-col">
              <label htmlFor="email" className="font-['Montserrat']">
                Fim
                <span className="p-2 text-[#FF4949] text-sm font-normal font-['Montserrat']">
                  *
                </span>
              </label>
              
              <input
                className={`bg-[#E4F2F5] rounded-lg border-none ${
                  experienceFormData[index]?.isCurrentJob ? 'opacity-60 cursor-not-allowed' : ''}`}
                id={`workEndDate-${index}`}
                placeholder="Mês/Ano"
                type="text"
                maxLength={7}
                name="workEndDate"
                value={experienceFormData[index]?.isCurrentJob
                    ? ""
                    : experienceFormData[index]?.workEndDate ?? ""
                }
                disabled={experienceFormData[index]?.isCurrentJob || false}
                onChange={(value) => {
                  handleExperienceInputChange(value, index, experienceFormData[index]?.isCurrentJob);
                }}
              />

              {/* Display invalid date input error message */}
              {displayInvalidDateFormatErrMsg(experienceFormData[index]?.workEndDate, experienceErrors[index].workEndDate)}

            </div>
          </div>

          {/* Current job checkbox */}
          <div className="flex items-center gap-2 p-2">
            <input
              className="border-primary rounded-[2px] cursor-pointer"
              id={`isCurrentJob-${index}`}
              name="isCurrentJob"
              type="checkbox"
              
              // TODO: this works but is ugly. Some shit needs to be refactored somewhere else first...
              checked={experienceFormData[index].isCurrentJob[index]}
              onChange={() => {
                handleCheckboxChange(index);
                
                // Clear workEndDate every time the checkbox is toggled
                handleExperienceInputChange({ target: { name: "workEndDate", value: "" } }, index, !experienceFormData[index]?.isCurrentJob);
              }}
            />

            <label className="cursor-pointer" htmlFor={`isCurrentJob-${index}`}>
              Meu emprego atual
            </label>
          </div>

          {/* Work Description */}
          <div className="flex flex-col py-3">
            <label
              htmlFor="activatityDescription"
              className="font-['Montserrat']"
            >
              Descrição de atividades:
              <span className="p-2 text-[#FF4949] text-sm font-normal font-['Montserrat']">
                *
              </span>
            </label>

            <textarea
              className="h-[120px] bg-[#E4F2F5] rounded-lg border-none resize-none text-lg font-normal font-['Montserrat']"
              id={`description-${index}`}
              placeholder="Escreva aqui as suas responsabilidades"
              maxLength={400}
              name="description"
              value={experienceFormData[index]?.description ?? ""}
              required={true}
              onChange={(value) => {
                handleExperienceInputChange(value, index, experienceFormData[index]?.isCurrentJob);
              }}
            />{" "}

            <div className="text-right text-sm text-grayDark">
              {handleCountExperience(index) ?? 0} / 400 caracteres
            </div>
          </div>

          {/* Delete button is displayed on all forms except the first one */}
          {index > 0 && (
            <div className="flex justify-end gap-1">
              <Icon
                path={mdiDelete}
                size={0.8}
                className="mt-3.5 text-warning"
              />
              
              <button
                type="button"
                className="text-warning font-bold py-3"
                onClick={() =>
                  handleExperienceDelete(index, experienceFormData[index]?._id?.toString() || "")
                }
              >
                Remover formação
              </button>
            </div>
          )}

          {/* Form separation border line */}
          {/* Only visible on last form, otherwise create distance */}
          <div
            className={index === experienceFormData.length - 1
                ? "border-t border-grayMedium py-2 mt-4"
                : "py-30 mt-5"
            }
          />

          {/* Add another form button */}
          {/* Only visible on last created form */}
          {/* TODO: make invisible when form is not filled out corretly */}
          {index === experienceFormData.length - 1 && (
            <div className="flex items-center justify-center">
              <button
                type="button"
                className="third_form_add w-full px-4 py-2 rounded-lg border-dotted border-2 border-grayMedium"
                onClick={() => addNewExperienceForm(index)}
              >
                Adicionar outra experiência
              </button>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
}