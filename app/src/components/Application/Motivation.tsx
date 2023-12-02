import { useState, ChangeEvent } from 'react';
import { Icon } from '@mdi/react';
import { mdiChevronUp, mdiChevronDown } from '@mdi/js';

const Motivation = ({ register, errors }: any) => {

  // Variable for toggling visibility of the field
  const [toggleMotivation, setToggleMotivation] = useState(true);

  //Variable for keeping track of the length of the motivation
  const [motivation, setMotivation] = useState('');
  const maxLength = 800;

  // Function to make sure motivation is not above 800 characters
  const handleMotivationChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;
    if (text.length <= maxLength) {
      setMotivation(text);
    }
  };

return (
<div className="w-[65%] justify-center items-center">
  {/* Motivation field */}
    <button type="button" className="relative text-left flex-auto w-[100%] h-[3.3rem] rounded-tl-lg rounded-tr-lg bg-cyan-800 text-white font-bold font-['Montserrat'] pl-6 z-50"
    onClick={() => setToggleMotivation(!toggleMotivation)}>
      <div className="flex items-start">
        {toggleMotivation ? (
          <Icon path={mdiChevronUp} size={1} color="white" />
        ) : (
          <Icon path={mdiChevronDown} size={1} color="white" />
        )}
        Motivações
      </div>
    </button>

    {toggleMotivation && (
      <div className="relative border border-blueButton p-4 rounded-b-lg text-left bg-white z-50">
      <div className="flex flex-col">
        <label htmlFor="motivation">
          Queremos saber mais sobre você! Nos conte suas motivações para fazer parte do Educado
          {/* We want to know more about you! Tell us about your reasons for joining Educado */}
        </label>
        <textarea
          className="bg-sky-50 rounded-lg border-none"
          placeholder="Escreva aqui porque você quer fazer parte de projeto"
          maxLength={maxLength}
          value={motivation}
          {...register("motivation", { required: true })}
          onChange={handleMotivationChange}
        />
        <div className="text-right text-gray-500 text-sm font-normal font-['Montserrat']">
        {motivation.length}/{maxLength} caracteres
        </div>
      </div>
    </div>
    )}
  </div>
  );
};

export default Motivation;