import Home from "../pages/index"
import "@testing-library/jest-dom"
import { render, screen } from "@testing-library/react"

describe("Entry Page", () => {
    it("renders the Entry Page Component", () => {
        render(<Home />)

        expect(screen.getByTestId("EntryComponent")).toBeInTheDocument()
    })

    it("renders the Login and Register links", () => {
        render(<Home />)

        const loginLink = screen.getByTestId('GitHubLoginButton')

        expect(loginLink.textContent).toBe('Login using GitHub')
    })
})
