import { render, screen, waitFor } from "@testing-library/react";
import {MemoryRouter,Routes,Route} from 'react-router-dom'
import LampSingleView from "../LampSingleView";
import axios from 'axios'

jest.mock("axios")
const mockedAxios = axios as jest.Mocked<typeof axios>;

test("Test del loading dei dati", async () => {

    mockedAxios.get.mockResolvedValue({
        data: {
            id: 1,
            stato: "attivo",
            lum: 5,
            luogo: "test",
            area: 1,
            guasto: false,
            mode: "manuale",
        },
    });

    render(
        <MemoryRouter initialEntries={["/"]}>
            <Routes>
                <Route path="/" element={<LampSingleView areaId={1} lampioneId={1}/>} />
            </Routes>
        </MemoryRouter>
    );

    await waitFor(() => {
        const title = screen.getByText("Info sul lampione 1");
        expect(title).not.toBeNull();
    });
});