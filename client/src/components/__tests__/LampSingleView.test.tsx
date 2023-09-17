import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import {MemoryRouter,Routes,Route} from 'react-router-dom'
import LampSingleView from "../LampSingleView";
import axios from 'axios'

jest.mock("axios")
const mockedAxios = axios as jest.Mocked<typeof axios>;

test("Test del loading dei dati", async () => {

    mockedAxios.get.mockResolvedValue({
        data: {
            id: 1,
            IP: "1.1.1.1",
            luogo: "test",
            raggio: 10,
            area: 1,
            sig_time: 20,
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