import QuizBuildingComponent from "@/pages/quiz-building-page/quiz-building-component"
import "@testing-library/jest-dom"
import userEvent from '@testing-library/user-event'
import fetchMock from 'jest-fetch-mock'
import {render, screen } from "@testing-library/react"
import { Session } from "next-auth"

// Mocking useRouter otherwise errors appear in consolve related to it
jest.mock('next/navigation', () => ({
    useRouter: jest.fn()
}))

jest.mock("next-auth/react", () => {
    const mockSession: Session = {
      expires: new Date(Date.now() + 2 * 86400).toISOString(),
      user: { id: "mockId", name: "mockName", email: "mockEmail", image: "mockImage", role: "ADMIN" }
    };
    return {
      useSession: jest.fn(() => {
        return {data: mockSession, status: 'authenticated'}
      }),
    };
});

const mockQuizData = {"quiz_id":1,
"title":"Test Quiz",
"question":[{
    "question_id":1,
    "question_text":"Is this question 1?",
    "quiz_id":1,
    "answer":[{"answer_id":1,"answer_text":"Yes","is_correct_answer":1,"question_id":1},{"answer_id":2,"answer_text":"No","is_correct_answer":0,"question_id":1}]
    },
    {"question_id":2,
    "question_text":"Is this question 100?",
    "quiz_id":1,
    "answer":[{"answer_id":3,"answer_text":"Yes","is_correct_answer":0,"question_id":2},{"answer_id":4,"answer_text":"No","is_correct_answer":1,"question_id":2}]
    }]
}

describe("Quiz Building Page", () => {
    afterEach(() => {
        window.localStorage.clear()
        fetchMock.resetMocks()
    })

    it("renders the component when customer directs to the page", async () => {
        render(<QuizBuildingComponent />)

        expect(screen.getByText("Create A New Quiz")).toBeInTheDocument()
        expect(screen.getByText("+ Add Question")).toBeInTheDocument()
        expect(screen.getByText("Publish")).toBeInTheDocument()
    })

    it("renders the component when customer directs to the page to edit the quiz", async () => {
        window.localStorage.setItem("quizData", JSON.stringify(mockQuizData))
        render(<QuizBuildingComponent />)

        expect(screen.getByText("Edit quiz page")).toBeInTheDocument()
        expect(screen.getByDisplayValue("Is this question 1?")).toBeInTheDocument()
        expect(screen.getByDisplayValue("Is this question 100?")).toBeInTheDocument()
    })

    it("renders a question component when the customer adds question", async () => {
        render(<QuizBuildingComponent />)

        const addQuestionButton = screen.getByText("+ Add Question")
        expect(addQuestionButton).toBeInTheDocument()
        await userEvent.click(addQuestionButton)

        // Checking if all the elements associated with creating a question are present
        expect(screen.getByPlaceholderText("Question 1")).toBeInTheDocument()
        expect(screen.getByText("+ Add Answer")).toBeInTheDocument()
    })

    it("removes a question component when the customer removes question", async () => {
        render(<QuizBuildingComponent />)

        const addQuestionButton = screen.getByText("+ Add Question")
        expect(addQuestionButton).toBeInTheDocument()
        await userEvent.click(addQuestionButton)

        // checking if the question component is present 
        expect(screen.getByPlaceholderText("Question 1")).toBeInTheDocument()
        expect(screen.getByText("+ Add Answer")).toBeInTheDocument()

        const removeQuestionButton = screen.getByText("- Remove Question")
        expect(removeQuestionButton).toBeInTheDocument()
        await userEvent.click(removeQuestionButton)

        // Check to see if the question component has been removed
        // Sam (2019)
        expect(screen.queryAllByPlaceholderText("Question 1")).toEqual([])
        expect(screen.queryAllByText("+ Add Answer")).toEqual([])
    })


    it("renders an answer component when the customer adds answer", async () => {
        render(<QuizBuildingComponent />)

        const addQuestionButton = screen.getByText("+ Add Question")
        expect(addQuestionButton).toBeInTheDocument()
        await userEvent.click(addQuestionButton)

        // Check if question component is present
        expect(screen.getByPlaceholderText("Question 1")).toBeInTheDocument()
        expect(screen.getByText("+ Add Answer")).toBeInTheDocument()

        const addAnswerButton = screen.getByText("+ Add Answer")
        expect(addAnswerButton).toBeInTheDocument()
        await userEvent.click(addAnswerButton)

        // Check if answer component is present
        expect(screen.getByPlaceholderText("Answer 1")).toBeInTheDocument()
        expect(screen.getByText("Remove Answer")).toBeInTheDocument()
    })

    it("removes an answer component when the customer removes answer", async () => {
        render(<QuizBuildingComponent />)

        const addQuestionButton = screen.getByText("+ Add Question")
        expect(addQuestionButton).toBeInTheDocument()
        await userEvent.click(addQuestionButton)

        // checking if the question component is present 
        expect(screen.getByPlaceholderText("Question 1")).toBeInTheDocument()
        expect(screen.getByText("+ Add Answer")).toBeInTheDocument()

        const addAnswerButton = screen.getByText("+ Add Answer")
        expect(addAnswerButton).toBeInTheDocument()
        await userEvent.click(addAnswerButton)

        // Check to see if the question component has been removed
        expect(screen.getByPlaceholderText("Answer 1")).toBeInTheDocument()
        expect(screen.getByText("Remove Answer")).toBeInTheDocument()

        const removeAnswerButton = screen.getByText("Remove Answer")
        expect(removeAnswerButton).toBeInTheDocument()
        await userEvent.click(removeAnswerButton)

        // Check to see if the question component has been removed
        // Sam (2019)
        expect(screen.queryAllByPlaceholderText("Answer 1")).toEqual([])
        expect(screen.queryAllByText("Remove Answer")).toEqual([])
    })

})
