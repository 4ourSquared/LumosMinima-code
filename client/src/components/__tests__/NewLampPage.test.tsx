import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { Role } from "../../auth/Authorization";
import NewLampPage from "../NewLampPage";
import { ConfirmProvider } from "material-ui-confirm";

const mockUserData = { role: Role.Amministratore };
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useOutletContext: () => mockUserData,
}));

test("Test del form di creazione di un'area", async () => {
    render(
        
        <MemoryRouter initialEntries={["/"]}>
            <Routes>
                <Route path="/" element={<NewLampPage areaId={1}/>} />
            </Routes>
        </MemoryRouter>
        
    )
});