import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {MemoryRouter,Routes,Route} from 'react-router-dom'
import SensorSingleView from "../SensorSingleView";
import axios from 'axios'
import { Role } from "../../auth/Authorization";

jest.mock("axios")
const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockUserData = { role: Role.Amministratore };
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useOutletContext: () => mockUserData,
}));

    test("Test della funzione load", async () => {

        mockedAxios.get.mockResolvedValue({
            data: {
                id: 1,
                IP: "125.125.125.125",
                luogo: "test",
                raggio: 10,
                area: 1,
                sig_time: 20,
            },
        })

        render(
            <MemoryRouter initialEntries={["/"]}>
                <Routes>
                    <Route path="/" element={<SensorSingleView areaId={1} sensoreId={1}/>} />
                </Routes>
            </MemoryRouter>
        )

        await waitFor(() => {
            const title = screen.getByText("Info sul sensore 1")
            expect(title).not.toBeNull()
        })
    })

    test("Test della funzione sendSignal", async () => {

        const sendSignal = jest.fn(()=>{console.log("Segnale inviato")})
        
        mockedAxios.post.mockImplementation(async ()=>{ 
            sendSignal();
            return null
        })

        render(
            <MemoryRouter initialEntries={["/"]}>
                <Routes>
                    <Route path="/" element={<SensorSingleView areaId={1} sensoreId={1}/>} />
                </Routes>
            </MemoryRouter>
        )

        let button: Element | null = null
        await waitFor(() => {
            button = screen.getByText("Invia Segnale")            
        })
        userEvent.click(button!)

        await waitFor(() => {
            expect(sendSignal).toBeCalledTimes(1)
        })
    })
