import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";

// Hooks
import { getUserToken } from "../../../helpers/userInfo";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useSections } from "@contexts/courseStore";

// components
import { SectionArrowIcon } from "../../SectionArrowIcon";
import { ComponentList } from "../ComponentList";
import { ToolTipIcon } from "../../ToolTip/ToolTipIcon";

import { Component, Section } from "@interfaces/Course";

// icons
import {
  mdiChevronDown,
  mdiChevronUp,
  mdiDeleteCircle,
  mdiDotsVerticalCircle,
  mdiPlus,
} from "@mdi/js";
import { Icon } from "@mdi/react";
import { useState, useEffect, useRef } from "react";
import SectionServices from "../../../services/section.services";

//pop-ups
import { CreateLecture } from "../../CreateLecturePopUp";
import { CreateExercise } from "../../Exercise/CreateExercisePopUp";

interface Props {
  sid: string;
  savedSID: string;
  setSavedSID: (sid: string) => void;
  handleSectionDeletion: (sid: string) => void;
}

export function SortableItem({
  sid,
  savedSID,
  setSavedSID,
  handleSectionDeletion,
}: Props) {
  const [arrowDirection, setArrowDirection] = useState<string>(mdiChevronDown);
  const [toolTipIndex, setToolTipIndex] = useState<number>(4);
  const subRef = useRef<HTMLInputElement>(null);
  const openRef = useRef<HTMLInputElement>(null);

  const token = getUserToken();
  const { loadSectionToCache, getCachedSection, updateCachedSection, addCachedSectionComponent} = useSections();
  const cachedSection = getCachedSection(sid);
  const cachedComponents = cachedSection?.components;
  const [sectionTitle , setSectionTitle] = useState<string>(cachedSection?.title ?? "");
  // Fetch the section data from the server.
  useEffect(() => {
    try {
      if(!cachedSection) {
        const fetchSectionData = async () => {
          const res = await SectionServices.getSectionDetail(sid, token);
          loadSectionToCache(res);
          setSectionTitle(res.title);
        }
        fetchSectionData();
      }
    } catch (err) {
      toast.error("failed to fetch section data for section " + sid);
    }
  }, [sid, cachedSection, loadSectionToCache, token]);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: sid });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  //Toggles the arrow direction between up and down
  function changeArrowDirection() {
    if (arrowDirection === mdiChevronDown) {
      setArrowDirection(mdiChevronUp);
    } else {
      setArrowDirection(mdiChevronDown);
    }
  }

  type SectionPartial = {
    title: string;
    description: string;
  };
  // Create Form Hooks
  const {
    register: registerSection,
    handleSubmit: handleSectionUpdate,
    formState: { errors: sectionErrors },
  } = useForm<SectionPartial>();

  /**
   * SubmitHandler: update section
   *
   * @param data  The data to be updated
   */

    const handleComponentCreation = (newComponent: Component) => {
      addCachedSectionComponent(sid, newComponent);
    };

    // Used to format PARTIAL section data, meaning that it can be used to update the course data gradually
    const handleFieldChange = (field: keyof Section, value: string | number | Component[] | null) => {
      if (cachedSection) {
        updateCachedSection({[field]: value}, sid);
      }
    };

  const onSubmit: SubmitHandler<SectionPartial> = (data) => {
    if (data === undefined) return;
    if (cachedSection?.title === undefined && cachedSection?.description === undefined) {console.log("errrr", undefined); return}

    const changes: SectionPartial = {
      title: cachedSection.title,
      description: cachedSection.description,
    };

    SectionServices.saveSection(changes, sid, token)
      //.then(res => toast.success('Seção atualizada'))
      .catch((err) => toast.error(err));
  };

  useEffect(() => {
    if (cachedSection?.title === "Nova seção") {
      setArrowDirection(mdiChevronUp);
    }
  }, []);

  //If data is not found yet, show a loading message.
  if (cachedSection === undefined || cachedSection === null) {
    return <p>Loading...</p>;
  }

  //Else show the sections.
  return (
    <div>
      <div className="overflow-visible collapse w-full rounded border bg-white shadow-lg rounded-lg my-4">
        <input
          type="checkbox"
          className="peer w-4/5 h-full"
          defaultChecked={cachedSection.title === "Nova seção"}
          onChange={() => changeArrowDirection()}
          ref={openRef}
        />

        <div className="collapse-title flex flex-row-2 rounded-top text-primary normal-case peer-checked:bg-primary peer-checked:text-white ">
          <div className="flex w-5/6 ">
            <SectionArrowIcon
              setArrowDirection={setArrowDirection}
              arrowDirection={arrowDirection}
              Checkbox={openRef}
            />
            <p className="font-semibold">{sectionTitle?.length > 0 ? sectionTitle : "Nova seção"}</p>
          </div>
          <div className="flex collapse">
            <div
              onClick={() => handleSectionDeletion(sid)}
              className="btn btn-ghost hover:bg-transparent hover:text-primary"
            >
              {/**delete and move buttons on the left side of the section headers */}
              <Icon path={mdiDeleteCircle} size={1.2}></Icon>
            </div>
            <div
              className="flex collapse"
              ref={setNodeRef}
              style={style}
              {...attributes}
              {...listeners}
            >
              <div className="btn btn-ghost hover:bg-transparent hover:text-primary">
                {/**delete and move buttons on the left side of the section headers */}
                <Icon path={mdiDotsVerticalCircle} size={1.2}></Icon>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden collapse-content flex flex-col rounded-lg h-50  w-full rounded space-2 px-128 space-y-5">
          <form onSubmit={handleSectionUpdate(onSubmit)}>
            <div className="pt-5">
              <label htmlFor="title">Nome </label> {/*Title of section*/}
              <input
                type="text"
                defaultValue={sectionTitle ?? "Nova seção"}
                placeholder={sectionTitle ?? "Nome da seção"}
                className="text-gray-500 flex form-field bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                {...registerSection("title", { required: true })}
                onChange={(e) => {handleFieldChange("title", e.target.value); setSectionTitle(e.target.value)}} //update the section title
              />
              {sectionErrors.title && <span>Este campo é obrigatório!</span>}
              {/** This field is required */}
            </div>

            <div className="pt-5">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <label htmlFor="title" style={{ marginRight: '8px' }}>Descrição</label>
              <ToolTipIcon
                alignLeftTop={false}
                index={0}
                toolTipIndex={toolTipIndex}
                text={"😊Lembre-se que precisamos manter os alunos engajados! Quanto mais simples, objetivo e lúdico, melhor!"}
                tooltipAmount={2}
                callBack={setToolTipIndex}
              />
            </div>
              {/*description of section*/}
              <textarea
                defaultValue={cachedSection.description ?? ""}
                placeholder={cachedSection.description ?? "Descrição da seção"}
                className="text-gray-500 form-field bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                {...registerSection("description", { required: true })}
                onChange={(e) => {handleFieldChange("description", e.target.value)}} //update the section title
              />
              {sectionErrors.description && (
                <span>Este campo é obrigatório!</span>
              )}
              {/** This field is required */}
            </div>

            <div
              className="hidden"
              onClick={() => {
                onSubmit(cachedSection);
              }}
            >
              <input type="submit" ref={subRef} />
            </div>
          </form>

          <ComponentList
            sid={sid}
            components={cachedComponents ?? []}
          />

          {/**ADD lecture and exercise to the section */}
          <div className="mt-5 flex  w-full h-12 border border-dashed border-gray-400 rounded-lg flex-col-3 justify-center space-x-2">
            {/* The button to open create lecture modal */}
            <label
              htmlFor={`lecture-create-${sid}`}
              onClick={() => setSavedSID(sid)}
              className="btn std-btn bg-inherit hover:bg-transparent border border-transparent rounded-lg flex justify-right space-x-2  mb-5"
            >
              <Icon
                path={mdiPlus}
                size={1}
                className="hover:text-gray-500 text-gray-500 "
              />
              <p className="hover:text-gray-500 text-gray-500 normal-case ">
                Criar nova aula
              </p>
            </label>
            {/* Put this part before </body> tag */}
            <input
              type="checkbox"
              id={`lecture-create-${sid}`}
              className="modal-toggle"
            />
            <CreateLecture
              savedSID={savedSID}
              handleLectureCreation={handleComponentCreation}
            />{" "}
            {/** Create new Lecture */}
            <p className="text-gray-500 flex items-center text:align-right ">
              ou
            </p>
            {/** The button to open create exercise modal */}
            <label
              htmlFor={`exercise-create-${sid}`}
              onClick={() => setSavedSID(sid)}
              className="btn std-btn bg-inherit hover:bg-transparent border border-transparent rounded-lg flex justify-right space-x-2  mb-5"
            >
              <Icon
                path={mdiPlus}
                size={1}
                className="hover:text-gray-500 text-gray-500 "
              />
              <p className="hover:text-gray-500 text-gray-500 normal-case">
                Criar novo exercício
              </p>{" "}
              {/** Create new Exercise */}
            </label>
            <input
              type="checkbox"
              id={`exercise-create-${sid}`}
              className="modal-toggle"
            />
            <CreateExercise
              savedSID={savedSID}
              handleExerciseCreation={handleComponentCreation}
            />{" "}
            {/** Create new Exercise */}
          </div>

          {/** PLACEHOLDER FOR NUMBER OF ITEMS IN SECTION*/}
         
            <div className="flex flex-row-reverse">
              <label htmlFor="description " className="text-black">
                {cachedComponents?.length}/10 items
              </label>
              {/** PLACEHOLDER TEXT */}
              <ToolTipIcon
                alignLeftTop={true}
                index={1}
                toolTipIndex={toolTipIndex}
                text={
                  "📚 Em cada seção você pode adicionar até 10 itens, entre aulas e exercícios."
                }
                tooltipAmount={2}
                callBack={setToolTipIndex}
              />
            </div>
          
        </div>
      </div>
    </div>
  );
}
