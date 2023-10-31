export interface CourseDetail {
    status:  number;
    success: boolean;
    data:    Data;
}

export interface Data {
    _id:         string;
    sections:    Section[];
    title:       string;
    category:    string;
    coverImg:    string;
    description: string;
    author:      Author;
    modifiedAt:  Date;
    createdAt:   Date;
    __v:         number;
}

export interface Author {
    id:        string;
    firstName: string;
    lastName:  string;
}

export interface Section {
    exercises:     Exercise[];
    _id:           string;
    parentCourse:  string;
    title:         string;
    sectionNumber: number;
    description:   string;
    createdAt:     Date;
    modifiedAt:    Date;
    __v:           number;
}

export interface Exercise {
    id:               string;
    modifiedAt:       Date;
    answers:          Answer[];
    __v:              number;
    content?:         Content;
    onWrongFeedback?: Content;
}

export interface Answer {
    id:         string;
    text:       string;
    correct:    boolean;
    modifiedAt: Date;
}

export interface Content {
    type: string;
    url:  string;
}
