import MainMenuComponent from "../pages/main-menu-page/main-menu-component"
import "@testing-library/jest-dom"
import {render, screen} from "@testing-library/react"

// Mocking useRouter otherwise errors appear in consolve related to it
jest.mock('next/navigation', () => ({
    useRouter: jest.fn()
}))

describe("MainMenu Page", () => {
    beforeEach(() => {
        window.localStorage.clear()
    })

      
    it("renders the Main menu page component", () => {
        render(<MainMenuComponent />)

        expect(screen.getByTestId("MainMenuComponent")).toBeInTheDocument()
    })

    it("renders the correct buttons for Admin users", () => {
        // Setting is_admin = true in localStorage so the correct buttons can be displayed for admin
        window.localStorage.setItem("is_admin", JSON.stringify(true))
        expect(localStorage.getItem("is_admin")).toEqual(JSON.stringify(true))

        render(<MainMenuComponent />)

        const createNewQuizLink = screen.getByText("Create new quiz")
        const viewExistingQuizzes = screen.getByText("View existing quizzes")
        expect(createNewQuizLink).toBeInTheDocument()
        expect(viewExistingQuizzes).toBeInTheDocument()
    })

    it("renders the correct buttons for Admin users", () => {
        // Setting is_admin = false in localStorage so the correct buttons can be displayed for regular user
        window.localStorage.setItem("is_admin", JSON.stringify(false))
        expect(localStorage.getItem("is_admin")).toEqual(JSON.stringify(false))

        render(<MainMenuComponent />)

        const viewAvailableQuizzesLink = screen.getByText("View available quizzes")
        expect(viewAvailableQuizzesLink).toBeInTheDocument()
    })

    it("renders the Logout button", () => {
        render(<MainMenuComponent />)

        expect(screen.getByText("Logout")).toBeInTheDocument()
    })

})
