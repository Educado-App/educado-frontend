import { useMedia, useCourse, useSections } from "@contexts/courseStore";
import { getUserToken } from "@helpers/userInfo";
import { SubmitFunction } from "@interfaces/Course";
import { useNotifications } from "@components/notification/NotificationContext";
import { useNavigate } from "react-router-dom";
import { prepareFormData } from "@utilities/formDataUtils";

export const useCourseManagingHelper = () => {
    const { addNotification } = useNotifications();
    const { addMediaToCache, updateMedia } = useMedia();
    const { course, updateCourseField, getFormattedCourse } = useCourse();
    const { sections, getCachedSection } = useSections();
    const token = getUserToken();
    const navigate = useNavigate();

    const handleDialogEvent = (
        message: string,
        onConfirm: () => void,
        dialogTitle: string,
        setDialogTitle: (title: string) => void,
        setDialogMessage: (message: string) => void,
        setDialogConfirm: (confirm: () => void) => void,
        setShowDialog: (show: boolean) => void
    ) => {
        setDialogTitle(dialogTitle);
        setDialogMessage(message);
        setDialogConfirm(() => onConfirm);
        setShowDialog(true);
    };

    const handleCourseImageUpload = (file: File | null, courseImg: File | null, courseId: string) => {
        if (!file) return;
        const newMedia = { id: courseId, file: file, parentType: "c" };
        if (!courseImg) {
            addMediaToCache(newMedia);
            updateCourseField({ coverImg: courseId + "_c" });
        } else {
            updateMedia(newMedia);
        }
    };

    const handleSaveAsDraft = async (submitFunction: SubmitFunction): Promise<void> => {
        try {
            const updatedCourse = getFormattedCourse();
            const formData = prepareFormData(updatedCourse);
            await submitFunction(formData, token);
            onSuccessfulSubmit();
        } catch (error) {
            console.error(error);
        }
    };

    const handlePublishCourse = async (submitFunction: SubmitFunction): Promise<void> => {
        try {
            const updatedCourse = getFormattedCourse();
            updatedCourse.courseInfo.status = "published";
            const formData = prepareFormData(updatedCourse);

            await submitFunction(formData, token);
            onSuccessfulSubmit();
        }
        catch (err) {
            console.error(err);
        }
    };

    const onSuccessfulSubmit = () => {
        navigate("/courses");
        addNotification("Seções salvas com sucesso!");
    };

    const checkAllSectionsGotComponents = () => {
        const emptySections = [];
        for (const sec of sections) {
            if (sec.components.length === 0) {
                addNotification(`Secção: "${sec.title}", está vazia!`);
                emptySections.push(sec);
            }
        }
        return emptySections.length === 0;
    };

    const someSectionMissingRequiredFields = () => {
        return course.sections.some((section) => {
            const secInfo = getCachedSection(section);
            return secInfo?.title === "" || secInfo?.description === "";
        });
    };

    return {
        handleDialogEvent,
        handleCourseImageUpload,
        handleSaveAsDraft,
        handlePublishCourse,
        checkAllSectionsGotComponents,
        someSectionMissingRequiredFields,
    };
};

