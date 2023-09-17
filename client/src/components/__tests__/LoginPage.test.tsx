import { render, screen, waitFor } from "@testing-library/react";
import LoginPage from "../LoginPage";
import { MemoryRouter, BrowserRouter as Router, Routes, Route } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import * as login from "../../auth/LoginMechanism"

//mock della funzione che dovrebbe essere restituita dallo hook
const mockNavigate = jest.fn(()=>{console.log("Navigazione")})

//mock dell'implementazione dello hook
jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom')), // since you still want to use the actual MemoryRouter
    useNavigate: () => mockNavigate,
  }))

describe("Test della pagina di login", () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("Render della pagina di login", () => {
        render(
            <MemoryRouter initialEntries={["/"]}>
                <Routes>
                    <Route path="/" element={<LoginPage />}/>
                </Routes>
            </MemoryRouter>
        );

        const title = screen.getByText(/Lumos Minima/i);
        const usernameInput = screen.getByLabelText("Nome utente");
        const passwordInput = screen.getByLabelText("Password");

        expect(title).toBeInTheDocument();
        expect(usernameInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
    });

    test("Click sul pulsante Entra - login ha successo", async () => {

        //mock della funzione che dovrebbe essere restituita dallo hook
        const mockResult = jest.fn(async ()=>{return true})

        //mock dell'implementazione dello hook
        jest.spyOn(login, 'default').mockImplementation(() => mockResult);

        render(
            <MemoryRouter initialEntries={["/"]}>
                <Routes>
                    <Route path="/" element={<LoginPage />}/>
                </Routes>
            </MemoryRouter>
        );

        userEvent.click(screen.getByRole('button'));
        await waitFor(()=> {
            expect(mockNavigate).toBeCalledTimes(1);
        })
    })

    test("Click sul pulsante Entra - login fallisce", async () => {
        
        //mock della funzione che dovrebbe essere restituita dallo hook
        const mockResult = jest.fn(async ()=>{return false})

        //mock dell'implementazione dello hook
        jest.spyOn(login, 'default').mockImplementation(() => mockResult);

        render(
            <MemoryRouter initialEntries={["/"]}>
                <Routes>
                    <Route path="/" element={<LoginPage />}/>
                </Routes>
            </MemoryRouter>
        );

        userEvent.click(screen.getByRole('button'));
        await waitFor(()=> {
            expect(mockNavigate).not.toBeCalledTimes(1);
        })
    })
})
