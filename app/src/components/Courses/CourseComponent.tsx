import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import useSWR from 'swr'
import { toast } from 'react-toastify'

// Services
import CourseServices from '../../services/course.services'
import StorageService from '../../services/storage.services';

// Helpers
import { getUserInfo } from '../../helpers/userInfo'
import categories from "../../helpers/courseCategories";
import { BACKEND_URL } from '../../helpers/environment';

// Components
import { Dropzone } from '../Dropzone/Dropzone'
import { ToolTipIcon } from '../ToolTip/ToolTipIcon'
import NotFound from '../../pages/NotFound'
import Loading from '../general/Loading'
import Layout from '../Layout'

// Interface
import { Course } from '../../interfaces/Course'


interface CourseComponentProps {
  token: string;
  id: string | undefined;
  setTickChange: Function;
  setId: Function;
}


/**
 * This component is responsible for creating and editing courses.
 * 
 * @param token The user token
 * @param id The course id
 * @returns HTML Element
 */
export const CourseComponent = ({token, id, setTickChange, setId}: CourseComponentProps) => {

  const [coverImg, setCoverImg] = useState<File | null>()
  const [categoriesOptions, setCategoriesOptions] = useState<JSX.Element[]>([]);
  const [statusSTR, setStatusSTR] = useState<string>("draft");
  const [statusChange, setStatusChange] = useState<boolean>(false);
  const [toolTipIndex, setToolTipIndex] = useState<number>(4);
  const [charCount, setCharCount] = useState<number>(0);
  const [isLeaving, setIsLeaving] = useState<boolean>(false);
  const {register, handleSubmit, formState: { errors } } = useForm<Course>();

  const navigate = useNavigate()
  /**
     * Extra function to handle the response from the course service before it is passed to the useSWR hook
     * 
     * @param url The url to fetch the course details from backend
     * @param token The user token
     * @returns The course details
     */
  const getData = async (url: string, token: string) => {
    const res:any = await CourseServices.getCourseDetail(url, token)

    setStatusSTR(res.status);
    setCharCount(res.description.length);
    return res;
  }

  // Fetch Course Details
  if(id != "0"){
    var { data, error } = useSWR(
      token ? [`${BACKEND_URL}/api/courses/${id}`, token] : null,
      getData
    )
  }

   
  useEffect(() => {
    //TODO: get categories from db
    const inputArray = ["personal finance","health and workplace safety","sewing","electronics"];
    setCategoriesOptions(inputArray.map((categoryENG: string, key: number) => (
      <option value={categoryENG} key={key} >{categories[inputArray[key]]?.br}</option>
      )));
  }, []);


  const onSubmit: SubmitHandler<Course> = (data) => {
    
    let newStatus = statusSTR;
  
    if(statusChange){
      if(statusSTR === "draft"){
          newStatus = "published";
      }else{
          newStatus = "draft";
      }
      setStatusChange(false);
    }
    
    if (!isLeaving || confirm("Você tem certeza?") === true ) {

      const changes: Course = {
        title: data.title,
        description: data.description,
        category: data.category,
        difficulty: data.difficulty,
        status: newStatus,
        creator: getUserInfo().id,
        estimatedHours: data.estimatedHours,
        coverImg: id+"_"+"c"  
      }


      // StorageService.deleteFile(id, token);

      // Update course details
      // When the user press the button to the right, the tick changes and it goes to the next component
      // When the user press the draft button, it saves as a draft and goes back to the course list
      if(id != "0"){
        CourseServices.updateCourseDetail(changes, id, token)
        .then(() => {
          toast.success('Curso atualizado');
          setStatusSTR(changes.status);

          //Upload image with the actual id 
          StorageService.uploadFile({ id: id, file: coverImg, parentType: "c" });

          if(isLeaving){
            window.location.href = "/courses";
          
          } else {
            setTickChange(1);
            navigate(`/courses/manager/${id}/1`);
          }

        }) // Course updated
        .catch(err => toast.error(err)) // Error updating course
        
      } else {
        CourseServices.createCourse(changes, token)
        .then(res => {
          toast.success('Curso criado');

          //Upload image with the new id
          StorageService.uploadFile({ id: res.data._id, file: coverImg, parentType: "c" });


          if(isLeaving){
            window.location.href = "/courses";
            
          } else{
              setId(res.data._id);
              setTickChange(1);
              navigate(`/courses/manager/${res.data._id}/1`);
              
          }
        }) // Course created
        .catch(err => toast.error(err)) // Error creating course
      }
    }

    setIsLeaving(false);
  }

  if(!data && id != "0") return <Layout meta='course overview'><Loading /></Layout> // Loading course details
  if(error) return <NotFound/> // Course not found

  
  return (
    <div>
      <div className='w-full flex flex-row py-5'>
        <h1 className="text-2xl text-left font-bold justify-between space-y-4"> Informações gerais </h1>
        {/** Tooltip for course header*/}
        <ToolTipIcon index={0} toolTipIndex={toolTipIndex} text={"👩🏻‍🏫Nossos cursos são separados em seções e você pode adicionar quantas quiser!"} tooltipAmount={2} callBack={setToolTipIndex}/>
      </div>

      {/*White bagground*/}
      <div className="w-full float-right bg-white rounded-lg shadow-lg justify-between space-y-4 p-10">

        {/*Field to input the title of the new course*/}
        <form className="flex h-full flex-col justify-between space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col space-y-2 text-left">
            <label htmlFor='title'>Nome do curso</label> {/*Title*/}
            <input id="title-field" type="text" defaultValue={data ? data.title : ""} placeholder={data ? data.title : ""}
              className="form-field  bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              {...register("title", { required: true })}
            />
            {errors.title && <span className='text-warning'>Este campo é obrigatório</span>} {/** This field is required */}
          </div>
          
          <div className="flex items-center gap-8 w-full mt-8">

            {/*Field to select a level from a list of options*/}
            <div className="flex flex-col w-1/2 space-y-2 text-left  ">
              <label htmlFor='level'>Nível</label> {/** Level */}
              <select id="difficulty-field" 
              defaultValue={data ? data.difficulty : "Selecione o nível"}
              className="bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              {...register("difficulty", { required: true })}>
                {/*Hard coded options by PO, should be changed to get from db*/}
                <option disabled> Selecione o nível</option>
                <option value={1}>Iniciante</option> {/** Beginner */}
                <option value={2}>Intermediário</option> {/** Intermediate */}
                <option value={3}>Avançado</option> {/** Advanced */}
              </select>
              {errors.difficulty && <span className='text-warning'>Este campo é obrigatório</span>} {/** This field is required */}
            </div>

            {/*Field to choose a category from a list of options*/}
            <div className="flex flex-col w-1/2 space-y-2 text-left  ">
              <label htmlFor='category'>Categoria</label> 
              <select id="category-field"
                defaultValue={data ? data.category : "Selecione a categoria"}
                className="bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                {...register("category", { required: true })}>
                {/*Hard coded options by PO, should be changed to get from db*/}
                <option value={"Selecione a categoria"} disabled> Selecione a categoria</option>,
                {categoriesOptions}

              </select>
              {errors.description && <span className='text-warning'>Este campo é obrigatório</span>} {/** This field is required */}
            </div>
          </div>

          {/*Field to input the description of the course*/}
          <div className="flex flex-col space-y-2 ">
            <div className="flex items-center space-x-2"> {/* Container for label and icon */}
              <label className='text-left' htmlFor='description'>Descrição </label> {/** Description */} 
              <ToolTipIcon index={1} toolTipIndex={toolTipIndex} text={"😉 Dica: insira uma descrição que desperte a curiosidade e o interesse dos alunos"} tooltipAmount={2} callBack={setToolTipIndex}/>
            </div>
            <textarea id="description-field" maxLength={400} rows={4}
            defaultValue={data ? data.description : ""}
            placeholder={data ? data.description : ""}
            className="resize-none form-field focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-secondary"
            {...register("description", { required: true })}
            onChange={(e) => setCharCount(e.target.value.length)}
            />
            {errors.description && <span className='text-warning'>Este campo é obrigatório</span>} {/** This field is required */}
        
            <div className='text-right' >
            <label htmlFor="">{charCount}/400</label>
            </div>
          </div> 
          
          <div>
            {/*Cover image field*/}
            <div className="flex flex-col space-y-2 text-left">
              <label htmlFor='cover-image'>Imagem de capa</label> {/** Cover image */} 
            </div>
            <Dropzone inputType='image' callBack={setCoverImg}/>
            {errors.description && <span className='text-warning'>Este campo é obrigatório</span>} {/** This field is required */}
          </div>
          <div className='text-right' >
            <label htmlFor="">o arquivo deve conter no máximo 10Mb</label>
          </div>

          {/*Create and cancel buttons*/}
          <div className='modal-action'>
            <div className="flex items-center justify-between gap-4 w-full mt-8">
              <label onClick={() => { navigate("/courses") }} htmlFor='course-create' className="cursor-pointer underline py-2 px-4 bg-transparent hover:bg-warning-100 text-warning w-full transition ease-in duration-200 text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2  rounded">
                Cancelar e Voltar {/** Cancel */}
              </label>
              
              <label htmlFor='course-create' className="ml-56 underline py-2 px-4 bg-transparent hover:bg-primary-100 text-primary w-full transition ease-in duration-200 text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2  rounded">
                <button id="SaveAsDraft" onClick={()=>setIsLeaving(true)} type="submit" className='underline'>
                  Salvar como Rascunho {/** Save as draft */}
                </button>
              </label>
              <label htmlFor='course-create' className="h-12 p-2 bg-primary hover:bg-primary focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg">
                <button type="submit" id="addCourse" className='py-2 px-4 h-full w-full cursor-pointer'>
                  Adicionar seções {/** Add sections */}
                </button>
              </label>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
