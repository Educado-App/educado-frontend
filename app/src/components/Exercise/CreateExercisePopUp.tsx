import { useState, } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { getUserToken } from '../../helpers/userInfo';

// Icons
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import Icon from '@mdi/react';
import { mdiPlus } from '@mdi/js';


// Components
import AnswerCards from "../../components/Exercise/AnswerCards";
import{ CreateButtonCompont } from "../CreateButtonCompont";

// Interfaces
import { Answer } from "../../interfaces/Answer";
import { Exercise } from "../../interfaces/Exercise"

// Helpers
import ExerciseServices from "../../services/exercise.services";

// Pop-up messages
import { toast } from "react-toastify";


export interface ExercisePartial {
    title: string,
    question: string,
    answers: Answer[]
}

interface Props {
    savedSID: string,
    data: any
}

type Inputs = {
    title: string,
    question: string
};


export const CreateExercise = ({savedSID, data}:Props) => {

    let TempAnswers = [{text: "", correct: true, feedback: ""}, {text: "", correct: false, feedback: ""}];

    const [answers, setAnswers] = useState<Answer[]>(TempAnswers);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const { register, handleSubmit , formState: { errors } } = useForm<Inputs>();


    /** Token doesnt work, reimplement when it token is implemented */
    const token = getUserToken();
    
    const onSubmit: SubmitHandler<Inputs> = async (newData) => {

        if (savedSID === ""){
            //update 
            ExerciseServices.updateExercise({
                title: newData.title,
                question: newData.question,
                answers: answers
            }, 
            token, 
            data._id)

            .then(res => {
                toast.success("Exercício atualizada com sucesso");
                window.location.reload();
            })
            .catch(err => {
                toast.error("Fracassado: " + err); 
                setIsSubmitting(false);
            })

        } else {
            setIsSubmitting(true);
            
            ExerciseServices.addExercise({
                title: newData.title,
                question: newData.question,
                answers: answers
            }, token, savedSID)

            .then(() => {
                toast.success(`Exercício criado com sucesso`); 
                window.location.reload();
            }) /** Successfully created exercise */

            .catch(err => {
                toast.error("Fracassado: " + err); 
                setIsSubmitting(false);
            })
        }
    }

    return (
        <>
            <div className="modal" id={`exercise-create-${data ? data._id : "new"}-modal`}>
                <div className="bg-white bg-gradient-to-b rounded w-3/8 h-5/6">
                    <div className="p-5 bg-gradient-to-b from-primaryLight overflow-auto h-full">
                        <form onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col space-y-6 divide py-2">
                            <div className="rounded-md cursor-pointer p-2 focus:outline-none bg-base-100 border">
                                <div className="flex flex-col form-control align-items justify-content w-full">
                                    <label className="label">
                                        <span className="label-text">Título</span> {/*Title*/}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Adicione um título a este exercício" /*Add a title to this exercise*/
                                        defaultValue={data ? data.title : ""}
                                        className="input input-bordered w-full max-w-xs"
                                        {...register("title", { required: true })}
                                    />

                                    <label className="label">
                                        <span className="label-text">Pergunta</span> {/*Question*/}
                                    </label>
                                    <textarea
                                        className="textarea textarea-bordered h-24"
                                        defaultValue={data ? data.question : ""}
                                        placeholder="Adicione uma pergunta a este exercício" /*Add a question to this exercise*/
                                        {...register("question", { required: true })}
                                    ></textarea>

                                </div>
                            </div>

                            {/* divider */}
                            <div className="flex flex-col w-full">
                                <div className="divider"></div>
                            </div>

                            {/* Answers. Answers sometimes doesn't get loaded hence the conditional rendering ... */}
                            {answers ?
                                <div className="rounded-md cursor-pointer p-2 focus:outline-none bg-base-100 border ">
                                    <h1 className='text-md font-medium'>Resposta</h1>  {/** Answer */}
                                {   <AnswerCards update={setAnswers} initialAnswers={data? data.answers : answers } />}
                                </div>
                                :
                                <p>Carregando ...</p>  /** Loading ... */
                            }
                            {/*Create and cancel buttons*/}
                            <CreateButtonCompont data={data} isSubmitting={isSubmitting} typeButtons={`exercise-create-${data ? data._id : "new"}`}/>
                            
                        </form>
                    </div>
                </div>
            </div>
        </>

    );
};
