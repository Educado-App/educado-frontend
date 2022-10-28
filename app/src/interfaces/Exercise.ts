export interface Exercise {
    exerciseNumber: number,
    content: {
        type: string,
        url: string
    },
    on_wrong_feedback: {
        type: string,
        url: string
    },
    answers: [{
        answerNumber: number,
        text: string,
        correct: boolean
    },
    {
        answerNumber: number,
        text: string,
        correct: boolean
    }]
}