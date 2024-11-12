import { useState, useEffect } from "react";
import { useParams } from "react-router";

import { Course } from "../../interfaces/Course";
import { PhonePreview } from "./PhonePreview";

import { BACKEND_URL } from "../../helpers/environment";

import CourseServices from "../../services/course.services";
import { YellowWarning } from "../Courses/YellowWarning";
import { useNavigate } from "react-router-dom";
/* import Popup from "./Popup/Popup"; */
import GenericModalComponent from "../GenericModalComponent";

import Loading from "../general/Loading";
import Layout from "../Layout";

// Notification
import { useNotifications } from "../notification/NotificationContext";
import PhoneCourseSession from "./PhoneCourseSession";

interface Inputs {
  id: string;
  token: string;
  setTickChange: Function;
  courseData: Course;
}

// Create section
export const CoursePreview = ({
  id: propId,
  token,
  setTickChange,
  courseData,
}: Inputs) => {

  const { id: urlId } = useParams<{ id: string }>();
  const id = propId === "0" ? urlId : propId;
  const [onSubmitSubscribers, setOnSubmitSubscribers] = useState<Function[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [cancelBtnText, setCancelBtnText] = useState("Cancelar");
  const [confirmBtnText, setConfirmBtnText] = useState("Confirmar");
  const [dialogTitle, setDialogTitle] = useState("Cancelar alterações");

  const [dialogConfirm, setDialogConfirm] = useState<Function>(() => {});
  const [status, setStatus] = useState<string>("draft");

  const navigate = useNavigate();

  // Notification
  const { addNotification } = useNotifications();

  function notifyOnSubmitSubscriber() {
    onSubmitSubscribers.forEach((cb) => cb());
  }

  const handleDialogEvent = (
    dialogText: string,
    onConfirm: () => void,
    dialogTitle: string
  ) => {
    setDialogTitle(dialogTitle);
    setDialogMessage(dialogText);
    
    function confirmFunction() {
      onConfirm();
      CourseServices.updateCourseDetail(courseData, id, token);
    }

    setDialogConfirm(() => confirmFunction);
    setShowDialog(true);
  };

  const handleDraftConfirm = async () => {
    try {
      await updateCourseSections();
      navigate("/courses");
      addNotification("Seções salvas com sucesso!");
    } catch (err) {
      console.error(err);
    }
  };

  const handlePublishConfirm = async () => {
    try {
      updateCourseSections();
      if (status !== "published") {
        await CourseServices.updateCourseStatus(id, "published", token);
        navigate("/courses");
        addNotification("Curso publicado com sucesso!");
      } else {
        navigate("/courses");
        addNotification("Seções salvas com sucesso!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  async function updateCourseSections(): Promise<void> {
    notifyOnSubmitSubscriber();
    await CourseServices.updateCourseSectionOrder(sections, id, token);
  }

  function changeTick(tick: number) {
    setTickChange(tick);
    navigate(`/courses/manager/${id}/${tick}`);
  }

  /**
   * Extra function to handle the response from the course service before it is passed to the useSWR hook
   *
   * @param url The url to fetch the course details from backend
   * @param token The user token
   * @returns The course details
   */
  const getData = async (url: string /*, token: string*/) => {
    const res: any = await CourseServices.getCourseDetail(url, token);
    return res;
  };

  // Redirect to courses page when setLeaving is s

  // Fetch Course Details
  useEffect(() => {
    if (id !== "0") {
      getData(`${BACKEND_URL}/api/courses/${id}`)
        .then((data) => {
          setStatus(data.status);
          setSections(data.sections); // Array of section ID's
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [id, token]);

  if (loading && id != "0")
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

      <div className="">
        <div className="flex w-full items-center justify-between my-4">
          <div className="flex">
            <h1 className="text-2xl font-bold">Revisar curso</h1>
          </div>
        </div>

        <div className="flex w-full float-right space-y-4">
          <YellowWarning text="Navegue pelo seu curso na visualização do aluno antes de publicá-lo." />
        </div>

        <div className="flex w-full float-right items-center justify-center space-y-4 my-4">
          {/** Course Sections area  */}
          <div className="flex w-full flex-row justify-around gap-x-8 max-w-5xl">
            <PhonePreview title="Informações do curso" >
                <div>Left</div>
            </PhonePreview>
            <PhonePreview title="Seções do curso" >
                <PhoneCourseSession />
            </PhonePreview>
          </div>
        </div>

        {/*Create and cancel buttons*/}
        <div className='className="flex w-full float-right space-y-4 "'>
          <div className="flex items-center justify-between gap-4 w-full mt-8">
            <label
              onClick={() => changeTick(1)}
              className="whitespace-nowrap cursor-pointer underline py-2 pr-4 bg-transparent hover:bg-warning-100 text-primary w-full transition ease-in duration-200 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2  rounded"
            >
              Voltar para Seções
              {/** GO BACK TO COURSE CREATION PAGE 2/3 IN THE CHECKLIST */}
            </label>

            <label
              className={` ${
                status === "published" ? "invisible pointer-events-none" : ""
              } pl-32  underline py-2 bg-transparent hover:bg-primary-100 text-primary w-full transition ease-in duration-200 text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2  rounded `}
            >
              <label
                onClick={() => {
                  handleDialogEvent(
                    "Você tem certeza de que quer salvar como rascunho as alterações feitas?",
                    handleDraftConfirm,
                    "Salvar como rascunho"
                  );
                }}
                className="whitespace-nowrap hover:cursor-pointer underline"
              >
                Salvar como Rascunho {/** Save as draft */}
              </label>
            </label>

            <label className="h-12 p-2 bg-primary hover:bg-primary focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg">
              <label
                onClick={() => {
                  handleDialogEvent(
                    status === "published"
                      ? "Tem certeza de que deseja publicar o curso? Isso o disponibilizará para os usuários do aplicativo"
                      : "Tem certeza de que deseja publicar as alterações feitas no curso",
                    handlePublishConfirm,
                    "Publicar curso"
                  );
                }}
                className="whitespace-nowrap py-4 px-8 h-full w-full cursor-pointer"
              >
                {status === "published" ? "Publicar Edições" : "Publicar Curso"}{" "}
              </label>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
