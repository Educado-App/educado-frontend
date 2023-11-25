
import useSWR from 'swr';
import { useForm, SubmitHandler } from 'react-hook-form'
import { toast } from 'react-toastify';



// Hooks
import useToken from '../../../hooks/useToken';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';



// icons

import { mdiChevronDown, mdiChevronUp, mdiPlus, mdiDeleteCircle, mdiDotsVerticalCircle  } from '@mdi/js';

import Icon from '@mdi/react';

import { useState, useCallback } from 'react';

import SectionServices from '../../../services/section.services';
import { add } from 'cypress/types/lodash';


interface Props {

  sid: string,
  addOnSubmitSubscriber: Function
}

export function SortableItem({ sid, addOnSubmitSubscriber}: Props) {

  const [arrowDirction, setArrowDirection] = useState<any>(mdiChevronDown);

  
  //const token = "dummyToken";
  const token = useToken();
  
  // Fetch the section data from the server.
  const { data, error } = useSWR(
    token ? [sid, token] : null,
    SectionServices.getSectionDetail
  );

  
    

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: sid });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  //Toggles the arrow direction between up and down
  function changeArrowDirection (){
    if (arrowDirction === mdiChevronDown){
      setArrowDirection(mdiChevronUp);
    }else{
      setArrowDirection(mdiChevronDown);
    }
  }

  type SectionPartial = {
    title: string;
    description: string;
  };
  // Create Form Hooks
  const { register: registerSection, handleSubmit: handleSectionUpdate, formState: { errors: sectionErrors } } = useForm<SectionPartial>();
  
  
 

  /**
     * SubmitHandler: update section
     * 
     * @param data  The data to be updated
    */
  const onSubmit: SubmitHandler<SectionPartial> = (data) => {
    if(data === undefined) return;
    console.log(data);
    const changes: SectionPartial = {
        title: data.title,
        description: data.description
     }
     
     SectionServices.saveSection(changes, sid, token)
     .then(res => toast.success('Seção atualizada'))
     .catch(err => toast.error(err));
 }

 useCallback(() => {
  console.log("want to be add",sid)
  addOnSubmitSubscriber(()=>{onSubmit(data); });
 },[data]);

  //If data is not found yet, show a loading message.
  if(data === undefined) return (<p>Loading...</p>);
  

  

  


  //Else show the sections.
  return (

    <div >
      <div className='collapse w-full rounded border bg-white shadow-lg rounded-lg m-4'>
          <input type="checkbox" className="peer w-4/5 " onChange={changeArrowDirection} />

          
            <div className="collapse-title flex flex-row-2  rounded-top text-primaryDarkBlue normal-case peer-checked:bg-primaryDarkBlue peer-checked:text-white ">
              <div className='flex w-5/6 '>
                <Icon path={arrowDirction} size={1} />
                <p className="font-semibold">
                  {data.title ?? "Nome da seção"}
                </p>
                </div>
                <div className='flex collapse ml-80'>
                    <div className='btn btn-ghost hover:bg-transparent hover:text-primaryDarkBlue'>
                      {/**delete and move buttons on the left side of the section headers */}
                      <Icon path={mdiDeleteCircle} size={1.2}></Icon>
                      
                    </div>  
                    <div  className="flex w-32 collapse" ref={setNodeRef} style={style} {...attributes} {...listeners} >
                    <div className='btn btn-ghost hover:bg-transparent hover:text-primaryDarkBlue'>
                      {/**delete and move buttons on the left side of the section headers */}
                      <Icon path={mdiDotsVerticalCircle} size={1.2}></Icon>
                      
                    </div>  
                    </div>
               
              </div>  
          </div> 

            <div className="collapse-content flex flex-col rounded-lg h-50  w-full rounded space-2 px-128 space-y-5">
              <form
                  onSubmit={handleSectionUpdate(onSubmit)}

              >
                <div className="pt-5  ">
                  <label htmlFor='title '>Nome </label> {/*Title of section*/}
                  <input type="text"  placeholder={data.title?? "Nome da seção"}
                    className="text-gray-500 form-field bg-secondary focus:outline-none focus:ring-2 focus:ring-primaryDarkBlue focus:border-transparent"
                    {...registerSection("title", { required: true })}
                    
                  />
                  
                </div>

                <div className="pt-5">
                  <label htmlFor='title'>Descrição </label> {/*description of section*/}
                  <textarea placeholder={data.description ??"Descrição da seção"}
                    className="text-gray-500 form-field bg-secondary focus:outline-none focus:ring-2 focus:ring-primaryDarkBlue focus:border-transparent"
                    {...registerSection("description", { required: true })}
                />

                    {/**ADD lecture and exercise to the section */}
                <div className="mt-5 flex  w-full h-12 border border-dashed border-gray-400 rounded-lg flex-col-3 justify-center space-x-2 ">
                  <label className=" btn std-btn  bg-inherit hover:bg-transparent border border-transparent w-1/4 border rounded-lg flex space-x-2 mb-5 ">
                    <p className="hover:text-gray-500 text-gray-500 normal-case flex items-center "> 
                    <Icon path={mdiPlus} size={1} className=" " />
                    Adicionar Aula</p>
                  </label>
                  <p className='text-gray-500 flex items-center text:align-right '>ou</p>
                  <label className="btn std-btn bg-inherit hover:bg-transparent border border-transparent w-1/4 rounded-lg flex justify-right space-x-2  mb-5 ">
                    <p className="hover:text-gray-500 text-gray-500 normal-case flex items-center text:align-right"> 
                    <Icon path={mdiPlus} size={1} className=" " />
                    Adicionar Exercício</p>
                  </label>
                </div>

                  {/** PLACEHOLDER FOR NUMBER OF ITEMS IN SECTION*/}
                  <div className='flex flex-row-reverse'>                            
                        <label htmlFor='description'>0/10 items</label>{/** PLACEHOLDER TEXT */}</div>
                  
                    
                  </div>
              </form>
                
              
              </div>
              

          

        </div>
        
    </div>
  );
}