import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { useNotifications } from "../notification/NotificationContext";
import { useCourse } from '../../contexts/courseStore';
// Services
import CourseServices from "../../services/course.services";
import StorageServices from "../../services/storage.services";

// Helpers
import { getUserInfo } from "../../helpers/userInfo";
import categories from "../../helpers/courseCategories";

// Components
import { Dropzone } from "../Dropzone/Dropzone";
import { ToolTipIcon } from "../ToolTip/ToolTipIcon";
import Loading from "../general/Loading";
import Layout from "../Layout";
import GenericModalComponent from "../GenericModalComponent";

// Interface
import { Course } from "../../interfaces/Course";
import CourseGuideButton from "./GuideToCreatingCourse";

interface CourseComponentProps {
  token: string;
  id: string | undefined;
  setTickChange: (tick: number) => void;
  setId: (id: string) => void;
  updateHighestTick: (tick: number) => void;
}

/**
 * This component is responsible for creating and editing courses.
 *
 * @param token The user token
 * @param id The course id
 * @returns HTML Element
 */

export const CourseComponent = ({ token, id, setTickChange, setId, updateHighestTick }: CourseComponentProps) => {
  const {course, updateCourse } = useCourse();
  const [categoriesOptions, setCategoriesOptions] = useState<JSX.Element[]>([]);
  const [statusSTR, setStatusSTR] = useState<string>("draft");
  const [toolTipIndex, setToolTipIndex] = useState<number>(4);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [dialogMessage, setDialogMessage] = useState<string>("");
  const [dialogConfirm, setDialogConfirm] = useState<() => void>(() => {});
  const [cancelBtnText] = useState("Cancelar");
  const [confirmBtnText] = useState("Confirmar");
  const [dialogTitle, setDialogTitle] = useState("Cancelar alterações");

  const [charCount, setCharCount] = useState<number>(0);
  const [isLeaving, setIsLeaving] = useState<boolean>(false);

  const [previewCourseImg, setPreviewCourseImg] = useState<string | null>(null);
  const [courseImg, setCourseImg] = useState<File | null>(null);
  const [data, setData] = useState<Course>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Course>();

  // Notification
  const { addNotification } = useNotifications();

  const existingCourse = id != "0";

  const navigate = useNavigate();

     /**
     * Extra function to handle the response from the course service before it is passed to the useSWR hook
     * 
     * @param url The url to fetch the course details from backend
     * @param token The user token
     * @returns The course details
     */

  useEffect(() => {
    //TODO: get categories from db
    const inputArray = [
      "personal finance",
      "health and workplace safety",
      "sewing",
      "electronics",
    ];
    setCategoriesOptions(
      inputArray.map((categoryENG: string, key: number) => (
        <option value={categoryENG} key={key}>
          {categories[inputArray[key]]?.br}
        </option>
      ))
    );
  }, []);

  useEffect(() => {
    setData(course);
    if (course !== null && course !== undefined) {
      setStatusSTR(course.status);
      setCharCount(course.description.length);
    }
  }, [course]);

  const formatCourse = (data: Partial<Course>): Course => {
    return {
      title: data.title ?? '',
      description: data.description ?? '',
      category: data.category ?? '',
      difficulty: data.difficulty ?? 0,
      status: data.status ?? 'draft',
      creator: data.creator ?? '',
      estimatedHours: data.estimatedHours ?? 0,
      coverImg: data.coverImg ?? '',
    };
  };

  //Used to format PARTIAL course data, meaning that it can be used to update the course data gradually
  const handleFieldChange = (field: keyof Course, value: string | number | File | null) => {
    const updatedData = { ...course, [field]: value };
    updateCourse(formatCourse(updatedData));
  };

  const handleDialogEvent = (
    message: string,
    onConfirm: () => void,
    dialogTitle: string
  ) => {
    setDialogTitle(dialogTitle);
    setDialogMessage(message);
    setDialogConfirm(() => onConfirm);
    setShowDialog(true);
  };

  useEffect(() => {
    const fetchPreview = async () => {
      const fileSrc = await getPreviewCourseImg();
      if (fileSrc !== null && fileSrc !== undefined && fileSrc !== previewCourseImg) {
        setPreviewCourseImg(fileSrc);
      }
    };
    fetchPreview();
  }, [existingCourse, id]);

  const getPreviewCourseImg = async () => {
    if (existingCourse) {
      const courseImgId = id + "_c"; // Ensure `id` and `existingCourse` are defined
      const fileSrc = await StorageServices.getMedia(courseImgId);
      return fileSrc;
    }
    return null;
  };

  const handleFileUpload = (id : string | undefined) => {
    const file = courseImg;
    StorageServices.uploadFile({ id: id, file: file, parentType: "c" });
  };
  // Updates existing draft of course and navigates to course list
  const handleSaveExistingDraft = async (changes: Course) => {
    try {
      await CourseServices.updateCourseDetail(changes, id, token);
      //Upload image with the old id
      handleFileUpload(id);
      navigate("/courses");
      addNotification("Seções salvas com sucesso!");
    } catch (err) {
      toast.error(err as string);

    }
  };

  // Creates new draft course and navigates to course list
  const handleCreateNewDraft = async (data: Course) => {
    try {
      const newCourse = await CourseServices.createCourse(data, token);
      console.log("creating new draft", data);
      //Upload image with the new id
      handleFileUpload(newCourse.data._id);

      navigate("/courses");
      addNotification("Seção deletada com sucesso!");
    } catch (err) {
      toast.error(err as string);
    }
  }

  // Creates new course and navigates to section creation for it
  const handleCreateNewCourse = async (data: Course) => {
    try {
      const newCourse = await CourseServices.createCourse(data, token);
      addNotification("Curso criado com sucesso!");
      //Upload image with the new id
      handleFileUpload(newCourse.data._id);

      setId(newCourse.data._id);
      setTickChange(1);
      updateHighestTick(1);
      navigate(`/courses/manager/${newCourse.data._id}/1`);
    } catch (err) {
      // Course created
      toast.error(err as string);
    }
  };

  //Used to prepare the course changes before sending it to the backend
  const prepareCourseChanges = (data: Course): Course => {
    return {
      title: data.title,
      description: data.description,
      category: data.category,
      difficulty: data.difficulty,
      status: statusSTR,
      creator: getUserInfo().id,
      estimatedHours: data.estimatedHours,
      coverImg: id + "_" + "c",
    };
  }

  const onSubmit: SubmitHandler<Course> = (data) => {
    const changes = prepareCourseChanges(data);
    if (isLeaving) {
      
      // left button pressed
      // StorageService.deleteFile(id, token);
  
      // Update course details
      // When the user press the button to the right, the tick changes and it goes to the next component
      // When the user press the draft button, it saves as a draft and goes back to the course list
      if (existingCourse && statusSTR === "draft") {
        handleDialogEvent(
          "Você tem certeza de que quer salvar como rascunho as alterações feitas?",
          handleSaveExistingDraft.bind(this, changes),
          "Salvar como rascunho "
        );
      } else if (!existingCourse && statusSTR === "draft") {
        handleDialogEvent(
          "Você tem certeza de que quer salvar como rascunho as alterações feitas?",
          handleCreateNewDraft.bind(this, changes),
          "Salvar como rascunho "
        );
      }
      setIsLeaving(false);
    } else {
      updateCourse(changes);
      // right button pressed
      // Creates new course and navigates to section creation for it
      if (!existingCourse) {
        handleCreateNewCourse(changes);
      } else {
        // navigates to section creation for existing course
        setTickChange(1);
        navigate(`/courses/manager/${id}/1`);
      }
    }
  };

  if (!data && existingCourse)
    return (
      <Layout meta="course overview">
        <Loading />
      </Layout>
    ); // Loading course details


  return (
    <div>
      <GenericModalComponent
        title={dialogTitle}
        contentText={dialogMessage}
        cancelBtnText={cancelBtnText}
        confirmBtnText={confirmBtnText}
        isVisible={showDialog}
        onConfirm={async () => {
          await dialogConfirm();
        }}
        onClose={() => {
          setShowDialog(false);
        }} // Do nothing
      />
      <div className="w-full flex flex-row items-center justify-between py-5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold"> Informações gerais </h1>
          <ToolTipIcon
          alignLeftTop={false}
          index={0}
            toolTipIndex={toolTipIndex}
            text={
              "👩🏻‍🏫Nossos cursos são separados em seções e você pode adicionar quantas quiser!"
            }
            tooltipAmount={2}
            callBack={setToolTipIndex}
          />
        </div>
        <CourseGuideButton />
      </div>

      {/*Field to input the title of the new course*/}
      <form
        className="flex h-full flex-col justify-between space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/*White bagground*/}
        <div className="w-full float-right bg-white rounded-lg shadow-lg justify-between space-y-4 p-10">
          <div className="flex flex-col space-y-2 text-left">
            <label htmlFor="title">Nome do curso <span className="text-red-500">*</span></label> {/*Title*/}
            <input
              id="title-field"
              type="text"
              defaultValue={data ? data.title : ""}
              placeholder={data ? data.title : ""}
              className="form-field  bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              {...register("title", { required: true })}
              onChange={(e) => handleFieldChange('title', e.target.value)}
            />
            {errors.title && (
              <span className="text-warning">Este campo é obrigatório</span>
            )}{" "}
            {/** This field is required */}
          </div>

          <div className="flex items-center gap-8 w-full mt-8">
            {/*Field to select a level from a list of options*/}
            <div className="flex flex-col w-1/2 space-y-2 text-left  ">
            <label htmlFor='level'> Nível <span className="text-red-500">*</span></label> {/*asteric should not be hard coded*/}
              <select id="difficulty-field" 
              defaultValue={data ? data.difficulty : ""}
              className="bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              {...register("difficulty", { required: true })}
              onChange={(e) => handleFieldChange('difficulty', parseInt(e.target.value))}
              >
                {/*Hard coded options by PO, should be changed to get from db*/}
                <option value=""disabled> Selecione o nível</option>
                <option value={1}>Iniciante</option> {/** Beginner */}
                <option value={2}>Intermediário</option> {/** Intermediate */}
                <option value={3}>Avançado</option> {/** Advanced */}
              </select>
              <span className='text-warning min-h-[24px]'>{errors.difficulty ? 'Este campo é obrigatório': ''}</span>
            </div>

            {/*Field to choose a category from a list of options*/}
            <div className="flex flex-col w-1/2 space-y-2 text-left  ">
              <label htmlFor='category'>Categoria <span className="text-red-500">*</span></label> 
              <select id="category-field"
                defaultValue={data ? data.category : ""}
                className="bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                {...register("category", { required: true })}
                onChange={(e) => handleFieldChange('category', e.target.value)}
              >
                {/*Hard coded options by PO, should be changed to get from db*/}
                <option value="" disabled> Selecione a categoria</option>,
                {categoriesOptions}

              </select>
              <span className='text-warning min-h-[24px]'>{errors.category ? 'Este campo é obrigatório': "               "}</span>
            </div>
          </div>

          {/*Field to input the description of the course*/}
          <div className="flex flex-col space-y-2 ">
            <div className="flex items-center space-x-2"> {/* Container for label and icon */}
              <label className='text-left' htmlFor='description'>Descrição <span className="text-red-500">*</span> </label> {/** Description */} 
              <ToolTipIcon alignLeftTop={false} index={1} toolTipIndex={toolTipIndex} text={"😉 Dica: insira uma descrição que desperte a curiosidade e o interesse dos alunos"} tooltipAmount={2} callBack={setToolTipIndex}/>
            </div>
            <textarea id="description-field" maxLength={400} rows={4}
            defaultValue={data ? data.description : ""}
            placeholder={data ? data.description : ""}
            className="resize-none form-field focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-secondary"
            {...register("description", { required: true })}
            onChange={(e) => {
              setCharCount(e.target.value.length);
              handleFieldChange('description', e.target.value);
            }}
            />
            {errors.description && (
              <span className="text-warning">Este campo é obrigatório</span>
            )}{" "}
            {/** This field is required */}
            <div className="text-right">
              <label htmlFor="">{charCount}/400</label>
            </div>
          </div>

          <div>
            {/*Cover image field*/}
            <div className="flex flex-col space-y-2 text-left">
              <label htmlFor='cover-image'>Imagem de capa <span className="text-red-500">*</span></label> {/** Cover image */} 
            </div>
            <Dropzone inputType='image' id={id ?? "0"} previewFile={previewCourseImg} onFileChange={setCourseImg} />
            {errors.description && <span className='text-warning'>Este campo é obrigatório</span>} {/** This field is required */}
          </div>
        </div>
        {/*Create and cancel buttons*/}
        <div className="modal-action pb-10">
          <div className="whitespace-nowrap flex items-center justify-between w-full mt-8">
            <label
              onClick={() => {
                navigate("/courses");
              }}
              htmlFor="course-create"
              className="cursor-pointer underline py-2 pr-4 bg-transparent hover:bg-warning-100 text-warning w-full transition ease-in duration-200 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2  rounded"
            >
              Cancelar e Voltar {/** Cancel */}
            </label>

            <label
              htmlFor="course-create"
              className={` ${
                statusSTR === "published" ? "invisible pointer-events-none" : ""
              } whitespace-nowrap ml-42 underline py-2 px-4 bg-transparent hover:bg-primary-100 text-primary w-full transition ease-in duration-200 text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2  rounded`}
            >
              <button
                id="SaveAsDraft"
                onClick={() => setIsLeaving(true)}
                type="submit"
                className="underline"
              >
                Salvar como Rascunho {/** Save as draft */}
              </button>
            </label>

            <label
              htmlFor="course-create"
              className="whitespace-nowrap h-12 p-2 bg-primary hover:bg-primary focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
            >
              <button
                type="submit"
                id="addCourse"
                className="flex items-center justify-center py-4 px-8 h-full w-full cursor-pointer"
              >
                Adicionar seções {/** Add sections */}
              </button>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};
