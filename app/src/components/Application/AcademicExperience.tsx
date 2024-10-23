import { useState } from 'react';
import { Icon } from "@mdi/react";

import { mdiChevronDown, mdiChevronUp } from "@mdi/js";
const AcademicExperiences = ({ register }: any) => {

  // Variable for toggling visibility of the field
  const [toggleAcademicExperiences, setToggleAcademicExperiences] = useState(false);

return (
<div className="w-[65%] justify-center items-center">
{/* Academic Experience fields */}
  <button type="button" className="relative text-left flex-auto w-[100%] h-[3.3rem] rounded-tl-lg rounded-tr-lg bg-cyan-800 text-white font-bold font-['Montserrat'] pl-6 z-50"
    onClick={() => setToggleAcademicExperiences(!toggleAcademicExperiences)}>
      <div className="flex items-start">
        {toggleAcademicExperiences ? (
            <Icon path={mdiChevronUp} size={1} color="white" />
        ) : (
            <Icon path={mdiChevronDown} size={1} color="white" />
        )}
        Experiências acadêmicas {/* Academic Experiences */}
      </div>
  </button>

    {toggleAcademicExperiences && (
        <div className="relative border flex-row border-blueButton p-4 rounded-b-lg gap-10 text-left bg-white z-50">
        <div className="grid grid-cols-2 gap-10"> 
            <p>Formação</p> {/* Training */}
            <p>Status</p> {/* Status */}
        </div>
        <div className="relative flex gap-10">
            <select className="w-[100%]  flex border-gray-300 py-3 px-4 bg-white placeholder-gray-400 text-lg focus:outline-none focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
            id="academicLevel"
            {...register("academicLevel", {required: true})}>
            
            <option value="Básico">Básico</option> {/* Basic */}
            <option value="Médio">Médio</option> {/* Medium */}
            <option value="Superior">Superior</option> {/* Superior */}
            </select>
        
            <select className="w-[100%]  flex border-gray-300 py-3 px-4 bg-white placeholder-gray-400 text-lg focus:outline-none focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
            id="academicStatus"
            {...register("academicStatus", { required: true })}>
            <option value="Em andamento">Em andamento</option> {/* In progress*/}
            <option value="Concluída">Concluída</option> {/* Completed*/}
            <option value="Não finalizado">Não finalizado</option> {/* not finalised*/}
            </select>
        </div>
        <div className="grid grid-cols-2 gap-10"> 
            <p>Curso</p> { /* Major*/ }
            <p>Instituição</p> { /* Institution*/ }
        </div>
        <div className="relative flex gap-10">
            <input
            type="text" id="major"
            className="w-[100%]  flex border-gray-300 py-3 px-4 bg-white placeholder-gray-400 text-lg focus:outline-none focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
            placeholder="Curso"
            {...register("major", { required: true })}
            />
        
            <input
            type="text" id="institution"
            className="w-[100%]  flex border-gray-300 py-3 px-4 bg-white placeholder-gray-400 text-lg focus:outline-none focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
            placeholder="Instituição"
            {...register("institution", { required: true })}
            />
        </div>
        <div className="grid grid-cols-2 gap-10"> 
            <p>Início</p> { /*Start Date*/ }
            <p>Fim</p> { /*End Date*/ }
        </div>
        <div className="relative flex gap-10">
            <input
            type="text" id="educationStartDate"
            className="w-[100%]  flex border-gray-300 py-3 px-4 bg-white placeholder-gray-400 text-lg focus:outline-none focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
            placeholder="Mês / Ano"
            {...register("educationStartDate", { required: true })}
            />
        
            <input
            type="text" id="educationEndDate"
            className="w-[100%]  flex border-gray-300 py-3 px-4 bg-white placeholder-gray-400 text-lg focus:outline-none focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
            placeholder="Mês / Ano"
            {...register("educationEndDate", { required: true })}
            />
        </div>
        </div>
    )}
    </div>
  );
};

export default AcademicExperiences;
