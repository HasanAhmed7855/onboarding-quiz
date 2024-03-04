
import { fetchQuizDetailsData } from "@/helperVarsAndFunctions/sharedFetchFunctions"
import TakeQuizComponent from "@/pages/take-quiz-page/take-quiz-component"
import "@testing-library/jest-dom"
import {act, render, screen } from "@testing-library/react"
import fetchMock from 'jest-fetch-mock'

const mockQuizDetailsApiData = {
    "message": "Quiz details retrieved successfully Mock",
    "quiz": {
        "quiz_id": 1,
        "title": "Test Quiz",
        "question": [
            {
                "question_id": 1,
                "question_text": "Is this question 1?",
                "quiz_id": 1,
                "answer": [
                    {
                        "answer_id": 1,
                        "answer_text": "Yes",
                        "is_correct_answer": 1,
                        "question_id": 1
                    },
                    {
                        "answer_id": 2,
                        "answer_text": "No",
                        "is_correct_answer": 0,
                        "question_id": 1
                    }
                ]
            },
            {
                "question_id": 2,
                "question_text": "Is this question 100?",
                "quiz_id": 1,
                "answer": [
                    {
                        "answer_id": 3,
                        "answer_text": "Yes",
                        "is_correct_answer": 0,
                        "question_id": 2
                    },
                    {
                        "answer_id": 4,
                        "answer_text": "No",
                        "is_correct_answer": 1,
                        "question_id": 2
                    }
                ]
            }
        ]
    }
}

const mockQuizId = "1"

// Mocking useRouter otherwise errors appear in consolve related to it
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    useSearchParams: jest.fn(() => ({ // Mocking getting the query param when the component is called
        get: () => "1"
    }))
}))

describe("Take Quiz Page", () => {
    afterEach(() => {
        window.localStorage.clear()
        fetchMock.resetMocks()
    })

    it("renders the Loading text before the API call can be made", async () => {
        render(<TakeQuizComponent />)

        expect(screen.getByText("Loading...")).toBeInTheDocument()
    })

    describe("With API handling", () => {
        let mockResponse: any
        let fetchSpy: any
        beforeEach(() => {
            mockResponse = {
                ok: true,
                json: jest.fn().mockResolvedValue(mockQuizDetailsApiData)
            }
            fetchSpy = jest.spyOn(window, 'fetch').mockResolvedValue(mockResponse as any) // mock fetch function used to get API data
        })

        it("returns data from API call to get the quiz details", async () => {
            const result = await fetchQuizDetailsData(mockQuizId) // Calling actual implementation

            expect(fetchSpy).toHaveBeenCalledWith('/api/get-quiz-details?quizid=1', { method: 'GET' })
            expect(mockResponse.json).toHaveBeenCalledTimes(1)
            expect(result).toEqual(mockQuizDetailsApiData.quiz)
        })

        it('renders component with data returned from API call', async () => {
            await act(async () => { // act allows states to update, meaning api data can update the states in this test
                render(<TakeQuizComponent />)
            })

            expect(screen.getByText("Test Quiz")).toBeInTheDocument()
            expect(screen.getByText("Is this question 1?")).toBeInTheDocument()
            expect(screen.getByText("Is this question 100?")).toBeInTheDocument()
            expect(screen.getByText("Submit")).toBeInTheDocument()
        })

        it('renders message to user informing them that getting api data failed', async () => {
            mockResponse = {
                ok: true,
                json: jest.fn().mockResolvedValue(mockQuizDetailsApiData)
            }
            fetchSpy = jest.spyOn(window, 'fetch').mockRejectedValueOnce(new Error('Async error'))

            await act(async () => {
                render(<TakeQuizComponent />)
            })

            expect(screen.getByTestId("TakeQuizFailMessage")).toBeInTheDocument()
        })
    })
})
