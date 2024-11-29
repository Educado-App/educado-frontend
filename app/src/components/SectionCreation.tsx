// Icon from: https://materialdesignicons.com/

import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useApi } from '../hooks/useAPI';

import { Course } from "../interfaces/Course";
import { SectionForm } from "./dnd/SectionForm";
import { SectionList } from "./dnd/SectionList";

import { BACKEND_URL } from "../helpers/environment";

import CourseServices from "../services/course.services";
import SectionServices from "../services/section.services";
import { YellowWarning } from "./Courses/YellowWarning";
import { useNavigate } from "react-router-dom";
/* import Popup from "./Popup/Popup"; */
import GenericModalComponent from "./GenericModalComponent";

import { ToolTipIcon } from "./ToolTip/ToolTipIcon";
import Loading from "./general/Loading";
import Layout from "./Layout";

// Notification
import { useNotifications } from "./notification/NotificationContext";
import CourseGuideButton from "./Courses/GuideToCreatingCourse";

interface Inputs {
  id: string;
  token: string;
  setTickChange: Function;
  courseData: Course;
}

// Create section
export const SectionCreation = ({
  id: propId,
  token,
  setTickChange,
  courseData,
}: Inputs) => {
  const { id: urlId } = useParams<{ id: string }>();
  const id = propId === "0" ? urlId : propId;
  const [isLeaving, setIsLeaving] = useState<boolean>(false);
  const [onSubmitSubscribers, setOnSubmitSubscribers] = useState<Function[]>(
    []
  );
  const [sections, setSections] = useState<any[]>([]);
  const [toolTipIndex, setToolTipIndex] = useState<number>(4);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [cancelBtnText, setCancelBtnText] = useState("Cancelar");
  const [confirmBtnText, setConfirmBtnText] = useState("Confirmar");
  const [dialogTitle, setDialogTitle] = useState("Cancelar alterações");

  const [dialogConfirm, setDialogConfirm] = useState<Function>(() => {});
  const [status, setStatus] = useState<string>("draft");

  const navigate = useNavigate();
  function addOnSubmitSubscriber(callback: Function) {
    setOnSubmitSubscribers((prevSubscribers) => [...prevSubscribers, callback]);
  }

  /**
   * Currently not used, but should be implemented in the future
   */
  // function removeOnSubmitSubscriber(callback: Function) {
  //   setOnSubmitSubscribers((prevSubscribers) =>
  //     prevSubscribers.filter((cb) => cb !== callback)
  //   );
  // }

  // Notification
  const { addNotification } = useNotifications();


  //Callbacks
  const { call: updateCourseDetail, isLoading: submitLoading, error } = useApi(CourseServices.updateCourseDetail);

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
    
    async function confirmFunction() {
      onConfirm();
     await updateCourseDetail(courseData, id, token);
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

  const checkSectionsNotEmpty = async () => {
    try {
      let emptySections = [];
      for(let i in sections) {
        const section = await SectionServices.getSectionDetail(sections[i], token);
        if(section.components.length === 0) {
          emptySections.push(section);
        }
      }
      for(let emptySection of emptySections) {
        addNotification(`Secção: "${emptySection.title}", está vazia!`);
      }

      return emptySections.length === 0;
    } catch (err) {
      console.error(err);
    }
  };

  const checkSectionsNotEmpty = async () => {
    try {
      let emptySections = [];
      for(let i in sections) {
        const section = await SectionServices.getSectionDetail(sections[i], token);
        if(section.components.length === 0) {
          emptySections.push(section);
        }
      }
      for(let emptySection of emptySections) {
        addNotification(`Secção: "${emptySection.title}", está vazia!`);
      }

      return emptySections.length === 0;
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirm = async () => {
    try {
        const sectionsAreValid = await checkSectionsNotEmpty();
      if (!sectionsAreValid) {
        addNotification("Curso não pode ser publicado devido a secções vazias!");
        return;
      }
      await updateCourseSections();
        setTickChange(2);
        navigate(`/courses/manager/${id}/2`);
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
        width="w-[500px]"
        onConfirm={async () => {
          await dialogConfirm();
        }}
        onClose={() => {
          setShowDialog(false);
        }} // Do nothing
        loading={submitLoading}
      />

      <div className="">
        <div className="flex w-full items-center justify-between my-4">
          <div className="flex">
            <h1 className="text-2xl font-bold">Seções do curso </h1>
            {/** Tooltip for course sections header*/}
            <ToolTipIcon
            alignLeftTop={false}
              index={0}
              toolTipIndex={toolTipIndex}
              text={
                "👩🏻‍🏫Nossos cursos são separados em seções e você pode adicionar quantas quiser!"
              }
              tooltipAmount={1}
              callBack={setToolTipIndex}
            />
          </div>
          <CourseGuideButton />
        </div>

        <div className="flex w-full float-right space-y-4">
          <YellowWarning text="Você pode adicionar até 10 itens em cada seção, entre aulas e exercícios." />
        </div>

        <div className="flex w-full float-right items-center justify-left space-y-4">
          {/** Course Sections area  */}
          <div className="flex w-full flex-col space-y-2 ">
            <SectionList
              sections={sections}
              setSections={setSections}
              addOnSubmitSubscriber={addOnSubmitSubscriber}
            />
            <SectionForm setSections={setSections} />
          </div>
        </div>

        {/*Create and cancel buttons*/}
        <div className='className="flex w-full float-right space-y-4 "'>
          <div className="flex items-center justify-between gap-4 w-full mt-8">
            <label
              onClick={() => changeTick(0)}
              className="whitespace-nowrap cursor-pointer underline py-2 pr-4 bg-transparent hover:bg-warning-100 text-primary w-full transition ease-in duration-200 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2  rounded"
            >
              Voltar para Informações{" "}
              {/** GO BACK TO COURSE CREATION PAGE 1/3 IN THE CHECKLIST */}
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

            <label className="h-12 p-2 bg-primary hover:bg-primaryHover focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg">
              <label
                onClick={() => handleConfirm()}
                className="whitespace-nowrap py-4 px-8 h-full w-full cursor-pointer"
              >
                Revisar Curso
              </label>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
