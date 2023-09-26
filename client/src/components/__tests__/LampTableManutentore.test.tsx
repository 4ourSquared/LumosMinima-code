import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {MemoryRouter,Routes,Route} from 'react-router-dom'
import axios from 'axios'
import { ConfirmProvider } from 'material-ui-confirm';
import { Role } from "../../auth/Authorization";
import LampTable from "../LampTable";

jest.mock("axios")
const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockUserData = { role: Role.Manutentore };
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useOutletContext: () => mockUserData,
}));

describe("Test del modulo LampTable", () => {
    test("Test della funzione load", async () => {

    mockedAxios.get.mockResolvedValue({
        data: [
            {
                id: 1,
                stato: "attivo",
                lum: 5,
                luogo: "test",
                area: 1,
                guasto: false,
                mode: "manuale",
            },
            {
                id: 2,
                stato: "attivo",
                lum: 5,
                luogo: "test",
                area: 1,
                guasto: false,
                mode: "manuale",
            },
            {
                id: 3,
                stato: "attivo",
                lum: 5,
                luogo: "test",
                area: 1,
                guasto: false,
                mode: "manuale",
            },
        ]
    })

    render(        
        <MemoryRouter initialEntries={["/"]}>
            <Routes>
                <Route path="/" element={<LampTable areaId={1}/>} />
            </Routes>
        </MemoryRouter>
        
    )

    await waitFor(async () => {
        let button = screen.getByText("Vai alla lista guasti",{selector:"button"});
        userEvent.click(button!);
    })

    })
});