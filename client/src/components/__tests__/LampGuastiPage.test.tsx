import LampGuastiPage from "../LampGuastiPage"
import {MemoryRouter,Routes,Route} from 'react-router-dom'
import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import userEvent from "@testing-library/user-event";
import LoginPage from "../LoginPage";
import '@testing-library/jest-dom/extend-expect'

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

test("Render della pagina dei guasti", async () => {

    mockedAxios.get.mockResolvedValue({
        data:[ {
            id: 1,
            stato: "attivo",
            lum: 5,
            luogo: "test",
            area: 1,
            guasto: true,
            mode: "manuale",
        },
    ],
    })
    
    render(
        <MemoryRouter initialEntries={["/"]}>
            <Routes>
                <Route path="/" element={<LampGuastiPage areaId={1}/>} />
                <Route path="/login" element={<LoginPage />} />
            </Routes>
        </MemoryRouter>
    )

    await waitFor(async () => {
        const titolo = await screen.findByText("Lista degli impianti luminosi guasti");
        const table = await screen.findByRole('table');
        expect(titolo).toBeInTheDocument();
        expect(table).toBeInTheDocument();
        const button = await screen.findByText("Esci");
        userEvent.click(button);
    })
})