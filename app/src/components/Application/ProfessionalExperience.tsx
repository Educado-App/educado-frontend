// ProfessionalExperienceSection.tsx
import { useState } from 'react';
import { Icon } from "@mdi/react";
import { mdiChevronDown, mdiChevronUp } from "@mdi/js";

const ProfessionalExperience = ({ register }: any) => {

  // Variable for toggling visibility of the field
  const [toggleProfessionalExperience, setToggleProfessionalExperience] = useState(false);

return (
<div className="w-[65%] justify-center items-center">
{/* Work Experience fields */}
    <button type="button" className="relative text-left flex-auto w-[100%] h-[3.3rem] rounded-tl-lg rounded-tr-lg bg-cyan-800 text-white font-bold font-['Montserrat'] pl-6 z-50"
    onClick={() => setToggleProfessionalExperience(!toggleProfessionalExperience)}>
        <div className="flex items-start">
        {toggleProfessionalExperience ? (
            <Icon path={mdiChevronUp} size={1} color="white" />
        ) : (
            <Icon path={mdiChevronDown} size={1} color="white" />
        )}
        Experiências profissionais {/* Professional Experience */}
        </div>
    </button>

    {toggleProfessionalExperience && (
        <div className="relative border flex-row border-blueButton p-4 rounded-b-lg gap-5 text-left bg-white z-50">
        <div className="grid grid-cols-2 gap-10"> 
            <p>Empresa</p> {/* company */}
            <p>Cargo</p> {/* position */}
        </div>
        <div className="relative flex gap-10">
            <input
            type="text" id="company"
            className="w-[100%]  flex border-gray-300 py-3 px-4 bg-white placeholder-gray-400 text-lg focus:outline-none focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
            placeholder="Mobile Education"
            {...register("company", { required: true })}
            />
    
            <input
            type="text" id="position"
            className="w-[100%]  flex border-gray-300 py-3 px-4 bg-white placeholder-gray-400 text-lg focus:outline-none focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
            placeholder="Product Designer"
            {...register("position", { required: true })}
            />
        </div>
        <div className="grid grid-cols-2 gap-10"> 
            <p>Início</p> {/* start */}
            <p>Fim</p> {/* end */}
        </div>
        <div className="relative flex gap-10">
            <input
            type="text" id="workStartDate"
            className="w-[100%]  flex border-gray-300 py-3 px-4 bg-white placeholder-gray-400 text-lg focus:outline-none focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
            placeholder="Mês / Ano"
            {...register("workStartDate", { required: true })}
            />
    
            <input
            type="text" id="workEndDate"
            className="w-[100%]  flex border-gray-300 py-3 px-4 bg-white placeholder-gray-400 text-lg focus:outline-none focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
            placeholder="Mês / Ano"
            {...register("workEndDate", { required: true })}
            />
        </div>
        <div className="grid grid-cols-1"> 
            <p>Descrição de atividades</p> {/* Description of activities */}
        </div>
        <div className="relative flex">
            <input
            type="text" id="workActivities"
            className="w-[100%]  flex border-gray-300 py-3 px-4 bg-white placeholder-gray-400 text-lg focus:outline-none focus:ring-2  focus:border-transparent focus:ring-sky-200 rounded-lg"
            placeholder="Escreva aqui as suas responsabilidades"
            {...register("workActivities", { required: true })}
            />
        </div>
        </div>
    )}
    </div>
  );
};

export default ProfessionalExperience;
