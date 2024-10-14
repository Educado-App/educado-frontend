import { CourseComponent } from "../components/Courses/CourseComponent";
import { SectionCreation } from "../components/SectionCreation";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { getUserToken } from '../helpers/userInfo';
import { BACKEND_URL } from '../helpers/environment';
import Checklist from "../components/Checklist";
import Layout from "../components/Layout";
import CourseServices from '../services/course.services';
import useSWR from 'swr';
import Loading from '../components/general/Loading';
import NotFound from '../pages/NotFound';

import { Course } from '../interfaces/Course';
import { getUserInfo } from '../helpers/userInfo';


/**
 * This component is responsible for creating and editing courses.
 * 
 * @param token The user token
 * @param id The course id
 * @returns HTML Element
 */

const CourseManager = () => {
    const token = getUserToken();
    let { id, tick } = useParams();
    const [tickChange, setTickChange] = useState<number>(parseInt(tick ?? "0"));
    const [highestTick, setHighestTick] = useState<number>(0);
    const [localData, setLocalData] = useState<any>(null);

    
   /**
     * Extra function to handle the response from the course service before it is passed to the useSWR hook
     * 
     * @param url The url to fetch the course details from backend
     * @param token The user token
     * @returns The course details
     */

    const getData = async (url: string, token: string) => {
        const res: any = await CourseServices.getCourseDetail(url, token);
        return res;
    };

    const { data, error } = useSWR(
        token && id !== "0" ? [`${BACKEND_URL}/api/courses/${id}`, token] : null,
        getData
    );

    const updateLocalData = (newData: Course) => {
        console.log("new status", newData.status)
        const changes: Course = {
            ...localData,
            ...newData,
            creator: id,
        };
    
        setLocalData(changes);
    };

    useEffect(() => {
        if (data) {
            setLocalData(data);
        }
    }, [data]);    

    const isCourseBasicInformation = (data: any) =>{
        return data.title && data.description && data.category && data.difficulty && data.status;
    }

    const doesCourseSectionsExist = (data: any) => {
        return data.sections && data.sections.length > 0
    }

    useEffect(() => {
        const calculateMaxTick = (data: any) => {
            if (isCourseBasicInformation(data)) {
                return 1;
            }
            if (doesCourseSectionsExist(data)) {
                return 1;
            }
            return 0;
        };
    
        if (id === "0") {
            return;
        }
    
        if (localData) {
            const maxTick = calculateMaxTick(localData);
            setHighestTick(maxTick);
        }
    }, [localData, id]);

    function handleTickChange(newTick: number) {
        setTickChange(newTick);
        if(newTick > highestTick) {
            setHighestTick(newTick);
        }
    }

    function setId(idInput: string) {
        id = idInput;
    }

    function updateHighestTick(newHighestTick: number) {
        setHighestTick(newHighestTick);
    }

    if (!data && id !== "0") return <Layout meta='course overview'><Loading /></Layout>;
    if (error) return <NotFound />;

    return (
        <Layout meta="Course Manager">
            <div className="flex flex-row">
                <Checklist tickChange={tickChange} highestTick={highestTick} id={id ?? ""} setTickChange={handleTickChange} />
                <div className='flex-none w-2/3 mr-20'>
                    {tickChange === 0 && <CourseComponent token={token} id={id} setTickChange={handleTickChange} setId={setId} courseData={localData} updateHighestTick={updateHighestTick} updateLocalData={updateLocalData}/>}
                    {tickChange === 1 && <SectionCreation id={id ?? ""} token={token} setTickChange={handleTickChange} courseData={localData} />}
                </div>
            </div>
        </Layout>
    );
};

export default CourseManager;