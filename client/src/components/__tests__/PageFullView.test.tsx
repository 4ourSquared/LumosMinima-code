import Page from "../PageFullView"
import {MemoryRouter,Routes,Route} from 'react-router-dom'
import { render, screen, waitFor } from "@testing-library/react";
import { Role } from "../../auth/Authorization";

const mockUserData = { role: Role.Amministratore };
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useOutletContext: () => mockUserData,
}));
describe("Test del modulo PageFullView", () => {
    test("Verifica se sono presenti header,main,footer", async () => {

    render(
        
        <MemoryRouter initialEntries={["/"]}>
            <Routes>
                <Route path="/" element={<Page/>} />
            </Routes>
        </MemoryRouter>
        
    )

    await waitFor(() => {
        const header = screen.queryByRole("banner")
        expect(header).not.toBeNull()
        const main = screen.queryByRole("main")
        expect(main).not.toBeNull()
        const footer = screen.queryByRole("contentinfo")
        expect(footer).not.toBeNull()

     })

    })
})