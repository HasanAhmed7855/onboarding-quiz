import MainMenuComponent from "../pages/main-menu-page/main-menu-component"
import "@testing-library/jest-dom"
import {render, screen} from "@testing-library/react"
import { Session } from "next-auth"
import { useSession } from "next-auth/react"
jest.mock("next-auth/react")

// Mocking useRouter otherwise errors appear in consolve related to it
jest.mock('next/navigation', () => ({
    useRouter: jest.fn()
}))

describe("MainMenu Page", () => {
    // Mocking next-auth's useSession to mimic authenticated user
    const mockSession: Session = {
        expires: new Date(Date.now() + 2 * 86400).toISOString(),
        user: { id: "mockId", name: "mockName", email: "mockEmail", image: "mockImage", role: "ADMIN" }
    };
    (useSession as jest.Mock).mockReturnValue({ data: mockSession, status: "authenticated" })
      
    it("renders the Main menu page component", () => {
        render(<MainMenuComponent />)

        expect(screen.getByTestId("MainMenuComponent")).toBeInTheDocument()
    })

    it("renders the correct buttons for Admin users", () => {
        render(<MainMenuComponent />)

        const createNewQuizLink = screen.getByText("Create new quiz")
        const viewExistingQuizzes = screen.getByText("View existing quizzes")
        expect(createNewQuizLink).toBeInTheDocument()
        expect(viewExistingQuizzes).toBeInTheDocument()
    })

    it("renders the correct buttons for Regular users", () => {
        jest.clearAllMocks();

        const mockSession: Session = {
            expires: new Date(Date.now() + 2 * 86400).toISOString(),
            user: { id: "mockId", name: "mockName", email: "mockEmail", image: "mockImage", role: "REGULAR" }
        };
        (useSession as jest.Mock).mockReturnValueOnce({ data: mockSession, status: "authenticated" })

        render(<MainMenuComponent />)

        const viewAvailableQuizzesLink = screen.getByText("View available quizzes")
        expect(viewAvailableQuizzesLink).toBeInTheDocument()
    })

    it("renders the Logout button", () => {
        render(<MainMenuComponent />)

        expect(screen.getByText("Logout")).toBeInTheDocument()
    })

})