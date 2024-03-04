import { verifyLogin } from "@/pages/sign-in/login-component"
import { verifyRegistration } from "@/pages/sign-in/registration-component"
import "@testing-library/jest-dom"
import fetchMock from 'jest-fetch-mock'
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context"

const mockEmptyInputsResponseMessage = {
    message: "Please do not leave the username or password empty. Inputs with just whitespace isn't allowed mock"
}

const mockUnauthorisedLoginResponseMessage = {
    message: "Authentication failed, incorrect username or password. Please try again"
}

const mockAuthorisedLoginResponseMessage = {
    message: "Authentication successful"
}

const mockAccountExistsResponseMessage = {
    message: "That user already exists. Please login with those credentials or register with a different username"
}

const mockRouter: AppRouterInstance = {
    back: function (): void {
        throw new Error("Function not implemented.")
    },
    forward: function (): void {
        throw new Error("Function not implemented.")
    },
    refresh: function (): void {
        throw new Error("Function not implemented.")
    },
    push: function (href: string, options?: undefined): void {
        throw new Error("Function not implemented.")
    },
    replace: function (href: string, options?: undefined): void {
        throw new Error("Function not implemented.")
    },
    prefetch: function (href: string): void {
        throw new Error("Function not implemented.")
    }
}

// Mocking useRouter otherwise errors appear in consolve related to it
jest.mock('next/navigation', () => ({
    useRouter: jest.fn()
}))

describe("Sign In Page - Login Component", () => {
    afterEach(() => {
        fetchMock.resetMocks()
        // ghiscoding (2019)
        jest.clearAllMocks();
    })

    let windowSpy: any
    beforeEach(() => {
        // Flask (2018)
        windowSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    })

    it("Returns back correct error message when input fields are empty", async () => {
        const mockResponse = {
            ok: false,
            status: 400,
            headers: {
                'Content-type': 'application/json'
            },
            json: jest.fn().mockResolvedValue(mockEmptyInputsResponseMessage)
        }
        const fetchSpy = jest.spyOn(window, 'fetch').mockResolvedValue(mockResponse as any)

        await verifyLogin("", "", mockRouter) // mock call so doesnt have to have correct params

        expect(fetchSpy).toHaveBeenCalledWith('/api/login-verification', {
            method: 'POST',
            body: "{\"username\":\"\",\"password\":\"\"}",
            headers: { 'Content-Type': 'application/json' }
        })
        expect(fetchSpy).toHaveBeenCalledTimes(1)

        expect(windowSpy).toHaveBeenCalledWith(mockEmptyInputsResponseMessage.message);
    })

    it("Returns back correct error message when login credentials are incorrect", async () => {
        const mockResponse = {
            ok: false,
            status: 401,
            headers: {
                'Content-type': 'application/json'
            },
            json: jest.fn().mockResolvedValue(mockUnauthorisedLoginResponseMessage)
        }
        const fetchSpy = jest.spyOn(window, 'fetch').mockResolvedValue(mockResponse as any)

        await verifyLogin("", "", mockRouter)

        expect(fetchSpy).toHaveBeenCalledTimes(1)
        expect(windowSpy).toHaveBeenCalledWith(mockUnauthorisedLoginResponseMessage.message);
    })

    it("enacts correct action when login credentials are correct", async () => {
        const mockResponse = {
            ok: true,
            headers: {
                'Content-type': 'application/json'
            },
            json: jest.fn().mockResolvedValue(() => {mockAuthorisedLoginResponseMessage})
        }
        const fetchSpy = jest.spyOn(window, 'fetch').mockResolvedValue(mockResponse as any)

        const localStorageSetItemSpy = jest.fn();
        Object.defineProperty(window, 'localStorage', {
            value: {
              setItem: localStorageSetItemSpy,
            },
          });

        await verifyLogin("mock", "mock", mockRouter)

        expect(fetchSpy).toHaveBeenCalledTimes(1)
        // Stein (2019)
        expect(localStorageSetItemSpy).toHaveBeenCalled();
    })
})

describe("Sign In Page - Register Component", () => {
    afterEach(() => {
        fetchMock.resetMocks()
        // ghiscoding (2019)
        jest.clearAllMocks();
    })

    let windowSpy: any
    beforeEach(() => {
        // Flask (2018)
        windowSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    })
    
    it("Returns back correct error message when input fields are empty", async () => {
        const mockResponse = {
            ok: false,
            status: 400,
            headers: {
                'Content-type': 'application/json'
            },
            json: jest.fn().mockResolvedValue(mockEmptyInputsResponseMessage)
        }
        const fetchSpy = jest.spyOn(window, 'fetch').mockResolvedValue(mockResponse as any)

        await verifyRegistration("", "", mockRouter) // mock call so doesnt have to have correct params

        expect(fetchSpy).toHaveBeenCalledWith('/api/register-user', {
            method: 'POST',
            body: "{\"username\":\"\",\"password\":\"\"}",
            headers: { 'Content-Type': 'application/json' }
        })
        expect(fetchSpy).toHaveBeenCalledTimes(1)

        expect(windowSpy).toHaveBeenCalledWith(mockEmptyInputsResponseMessage.message);
    })

    it("Returns back correct error message when registration credentials already exist", async () => {
        const mockResponse = {
            ok: false,
            status: 409,
            headers: {
                'Content-type': 'application/json'
            },
            json: jest.fn().mockResolvedValue(mockAccountExistsResponseMessage)
        }
        const fetchSpy = jest.spyOn(window, 'fetch').mockResolvedValue(mockResponse as any)

        await verifyRegistration("", "", mockRouter)

        expect(fetchSpy).toHaveBeenCalledTimes(1)
        expect(windowSpy).toHaveBeenCalledWith(mockAccountExistsResponseMessage.message);
    })

    it("enacts correct action when registration credentials are valid", async () => {
        const mockResponse = {
            ok: true,
            headers: {
                'Content-type': 'application/json'
            },
            json: jest.fn().mockResolvedValue(() => {mockAuthorisedLoginResponseMessage})
        }
        const fetchSpy = jest.spyOn(window, 'fetch').mockResolvedValue(mockResponse as any)

        await verifyRegistration("mock", "mock", mockRouter)

        expect(fetchSpy).toHaveBeenCalledTimes(1)
        expect(windowSpy).toHaveBeenCalled();
    })
})
