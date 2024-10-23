import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Dropzone, dropzoneInstance } from "./Dropzone/Dropzone"; // Used image or video upload NOT IMPLEMENTED YET
import { toast } from "react-toastify";
import RichTextEditor from "./RichTextEditor";

// Contexts
// import useAuthStore from '../../contexts/useAuthStore';
// Hooks
import { getUserToken } from "../helpers/userInfo";
import { useNotifications } from "./notification/NotificationContext";

// Services
import StorageServices from "../services/storage.services";
import LectureService from "../services/lecture.services";

//components
import { ModalButtonCompont } from "./ModalButtonCompont";

// Icons
import { Icon } from "@mdi/react";
import { mdiInformationSlabCircleOutline } from "@mdi/js";

<Icon path={mdiInformationSlabCircleOutline} size={1} />;

type Inputs = {
  title: string;
  description: string;
  contentType: string;
  content: string;
};

interface Props {
  data: any;
  handleEdit: Function;
}
/**
 * This component is a modal that opens when the user clicks on the button to create a new lecture.
 * It has a form to input the data of the new lecture.
 *
 * @returns HTML Element
 */
export const EditLecture = ({ data, handleEdit }: Props) => {
  const [lectureContent, setLectureContent] = useState(null);
  //TODO: When tokens are done, Remove dummy token and uncomment useToken
  const token = getUserToken();

  //const sid = window.location.pathname.split("/")[2];

  // use-form setup
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const [contentType, setContentType] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { addNotification } = useNotifications();

  const toggler = (value: string) => {
    setContentType(value);
  };

  /**
   * Function to handle the submit of the form
   *
   * @param {Inputs} data The data from each field in the form put into an object
   */
  const onSubmit: SubmitHandler<Inputs> = async (newData) => {
    setIsSubmitting(true);
    LectureService.updateLecture(
      {
        title: newData.title,
        description: newData.description,
        contentType: newData.contentType,
        content: newData.content,
      },
      token,
      data._id
    )
      .then((res) => {
        const uploadedFile = dropzoneInstance.getFile();
        if (uploadedFile !== null) {
          StorageServices.uploadFile({
            id: res._id,
            file: uploadedFile,
            parentType: "l",
          });
        }
        handleEdit(newData.title);
        addNotification("Aula atualizada com sucesso");
        setIsSubmitting(false);
      })

      .catch((err) => {
        toast.error("Fracassado: " + err);
        setIsSubmitting(false);
      });
  };

  function returnFunction(lectureContent: any) {
    setLectureContent(lectureContent);
  }

  const [editorValue, setEditorValue] = useState<string>('');

// Initialize the editorValue with data.content if available (for editing)
useEffect(() => {
  if (data?.content) {
    setEditorValue(data.content);
    setValue('content', data.content);  // Initialize form value as well
  }
}, [data, setValue]);

const handleEditorChange = (value: string) => {
  setEditorValue(value); // Update local state
  setValue('content', value); // Manually set form value
  data.content = value;
};

  return (
    <>
      {/*Text shown in the top of create lecture*/}
      <div
        className="modal"
        id={`lecture-edit-${data ? data._id : "new"}-modal`}
      >
        <div className="modal-box bg-gradient-to-b from-primaryLight rounded w-11/12 max-w-xl">
          <h3 className="font-bold text-lg">Crie sua nova aula</h3>{" "}
          {/*Create your new lecture!*/}
          <p className="py-4">
            Preencha o formulário e inicie sua nova aula!
          </p>{" "}
          {/*Fill out the form and start your new lecture!*/}
          {/*Field to input the title of the new lecture*/}
          <form
            className="flex h-full flex-col justify-between space-y-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col space-y-2 text-left">
              <label htmlFor="title">Título</label> {/*Title*/}
              <input
                type="text"
                placeholder={"Insira o título da aula"}
                defaultValue={data ? data.title : ""}
                className="form-field focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                {...register("title", { required: true })}
              />
              {errors.title && (
                <span className="text-warning">Este campo é obrigatório</span>
              )}
            </div>
            {/*Field to input the description of the lecture*/}
            <div className="flex flex-col space-y-2 text-left">
              <label htmlFor="description">Descrição</label> {/*Description*/}
              <textarea
                rows={4}
                placeholder={"Insira o conteúdo escrito dessa aula"}
                defaultValue={data ? data.description : ""}
                className="resize-none form-field focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                {...register("description", { required: true })}
              />
              {/*defaultValue=Add a description to your lecture*/}
              {errors.description && (
                <span className="text-warning">Este campo é obrigatório</span>
              )}
            </div>
            <label htmlFor="content-type">Tipo de conteúdo</label>{" "}
            {/*Content type*/}
            <div className="flex flex-row space-x-8">
              <div>
                <label htmlFor="radio1">
                  <input
                    type="radio"
                    className="mr-2"
                    id="radio1"
                    value="video"
                    checked={
                      (data?.contentType === "video" && contentType === "") ||
                      contentType === "video"
                        ? true
                        : false
                    }
                    {...register("contentType", { required: true })}
                    onChange={(e) => {
                      toggler(e.target.value);
                    }}
                  />
                  Video
                </label>
              </div>

              <div>
                <label htmlFor="radio2" className="space-x-2">
                  <input
                    type="radio"
                    className="mr-2"
                    id="radio2"
                    value="text"
                    checked={
                      (data?.contentType === "text" && contentType === "") ||
                      contentType === "text"
                        ? true
                        : false
                    }
                    {...register("contentType", { required: true })}
                    onChange={(e) => {
                      toggler(e.target.value);
                    }}
                  />
                  Texto Estilizado
                </label>
              </div>

              {errors.contentType && (
                <span className="text-warning">Este campo é obrigatório</span>
              )}
            </div>
            {/*One day this will be file*/}
            <div className="flex flex-col space-y-2 text-left">
              {(data?.contentType === "video" && contentType === "") ||
              contentType === "video" ? (
                <>
                  <label htmlFor="cover-image">
                    Arquivo de entrada: vídeo ou imagem
                  </label>{" "}
                  {/*Input file*/}
                  <Dropzone inputType="video"></Dropzone>
                </>
              ) : (data?.contentType === "text" && contentType === "") ||
                contentType === "text" ? (
                <>
                  <label htmlFor="content">Formate o seu texto abaixo</label>
                  <RichTextEditor 
                    value={editorValue}  // Use the local editorValue for the content
                    onChange={handleEditorChange} 
                  />

                </>
              ) : (
                <p></p>
              )}
              {/* {errors.description && <span className='text-warning'>Este campo é obrigatório</span>}*/}
            </div>
            {/*Create and cancel buttons*/}
            <ModalButtonCompont
              type="edit"
              isSubmitting={isSubmitting}
              typeButtons={`lecture-edit-${data._id}`}
            />
          </form>
        </div>
      </div>
    </>
  );
};
