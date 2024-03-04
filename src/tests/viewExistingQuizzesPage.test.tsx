import ViewExistingQuizzesComponent, { fetchExistingQuizData } from "@/pages/view-existing-quizzes-page/view-existing-quizzes-component"
import "@testing-library/jest-dom"
import {act, render, screen } from "@testing-library/react"
import fetchMock from 'jest-fetch-mock'
import React from "react"

const mockExistingQuizApiData = {
    "message": "Quizzes retrieved successfully Mock",
    "quizzes": [
        {
            "quiz_id": 1,
            "title": "Test Quiz"
        }
    ]
}

// Mocking useRouter otherwise errors appear in consolve related to it
jest.mock('next/navigation', () => ({
    useRouter: jest.fn()
}))

describe("View Existing Quizzes Page", () => {
    afterEach(() => {
        window.localStorage.clear()
        fetchMock.resetMocks()
    })

    it("renders the Loading text before the API call can be made", async () => {
        render(<ViewExistingQuizzesComponent />)

        expect(screen.getByText("Loading...")).toBeInTheDocument()
    })


    describe("With API handling", () => {
        let mockResponse: any
        let fetchSpy: any
        beforeEach(() => {
            mockResponse = {
                ok: true,
                json: jest.fn().mockResolvedValue(mockExistingQuizApiData)
            }
            fetchSpy = jest.spyOn(window, 'fetch').mockResolvedValue(mockResponse as any) // mock fetch function used to get API data
        })
    
        it('return data from API call to get existing quizzes', async () => {
            const result = await fetchExistingQuizData() // Calling actual implementation
        
            expect(fetchSpy).toHaveBeenCalledWith('/api/get-existing-quizzes', { method: 'GET' })
            expect(mockResponse.json).toHaveBeenCalledTimes(1)
            expect(result).toEqual(mockExistingQuizApiData.quizzes)
        })

        
        it('renders component with data returned from API call', async () => {
            await act(async () => { // act allows states to update, meaning api data can update the states in this test
                render(<ViewExistingQuizzesComponent />)
            })

            expect(screen.getByText("Test Quiz")).toBeInTheDocument()
        })

        it('renders correct buttons for the admin user', async () => {
            await act(async () => {
                window.localStorage.setItem("is_admin", JSON.stringify(true))

                render(<ViewExistingQuizzesComponent />)
            })

            expect(localStorage.getItem("is_admin")).toEqual(JSON.stringify(true))
            expect(screen.getByText("View Quiz")).toBeInTheDocument()
            expect(screen.getByText("Delete Quiz")).toBeInTheDocument()
        })
        
        it('renders correct buttons for the regular user', async () => {
            await act(async () => {
                render(<ViewExistingQuizzesComponent />)
            })

            expect(screen.getByText("Take Quiz")).toBeInTheDocument()
        })

        it('renders message to user informing them that getting api data failed', async () => {
            mockResponse = {
                ok: true,
                json: jest.fn().mockResolvedValue(mockExistingQuizApiData)
            }
            fetchSpy = jest.spyOn(window, 'fetch').mockRejectedValueOnce(new Error('Async error'))

            await act(async () => {
                render(<ViewExistingQuizzesComponent />)
            })

            expect(screen.getByTestId("ViewExistingQuizzesFailMessage")).toBeInTheDocument()
        })
    })
})
