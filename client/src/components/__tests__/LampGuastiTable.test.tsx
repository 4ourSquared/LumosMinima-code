import { render, screen, waitFor } from "@testing-library/react";
import {MemoryRouter,Routes,Route} from 'react-router-dom'
import LampGuastiTable from "../LampGuastiTable";
import LampItem from "../../types/LampItem";
import { ConfirmProvider } from 'material-ui-confirm';
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

test("fetch dati nella tabella dei guasti", async () => {
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
    })

    const{getByText} = render(
        <MemoryRouter initialEntries={["/"]}>
            <Routes>
                <Route path="/" element={<LampGuastiTable areaId={1} />}/>
            </Routes>
        </MemoryRouter>
    )

    
    await waitFor(async () => {
        expect(getByText("Indietro")).toBeInTheDocument();
        //const rows = screen.getAllByRole("row");
        //expect(rows).toBeInTheDocument();
    })
})