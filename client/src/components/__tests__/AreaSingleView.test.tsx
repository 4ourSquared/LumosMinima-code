import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {MemoryRouter,Routes,Route} from 'react-router-dom'
import axios from 'axios'
import {Role} from "../../auth/Authorization"
import AreaSingleView from "../AreaSingleView";
import { ConfirmProvider } from "material-ui-confirm";

jest.mock("axios")
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockUserData = {role:Role.Amministratore}
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useOutletContext: () => mockUserData
    })
);

describe("Test del modulo AreaSingleView", () => {

    test("Test del fetch", async () => {

        mockedAxios.get.mockResolvedValue({ 
            data:{
                id: 1,
                nome: "test",
                descrizione: "test",
                latitudine: "1.1",
                longitudine: "1.1",
                polling: 10,
                sensori: [
                    {
                        id: 1,
                        IP: "1.1.1.1",
                        luogo: "test",
                        raggio: 10,
                        area: 1,
                        sig_time: 20
                    }
                ],
                lampioni: [
                    {
                        id: 1,
                        stato: "attivo",
                        lum: 5,
                        luogo: "test",
                        area: 1,
                        guasto: false,
                        mode: "manuale"
                    }
                ]
            }
        })
    
        mockedAxios.put.mockResolvedValue({
            status: 200
        });
    
        render(
            <MemoryRouter initialEntries={["/tests"]}>
                <Routes>
                    <Route path="/:areaId" element={<AreaSingleView/>} />
                </Routes>
            </MemoryRouter>
        )

        await waitFor(()=> {
            const rows = screen.getAllByRole("table")
            //renderizza le tabelle?
            expect(rows.length).toEqual(2)
            //ci sono lampione e sensore?
            const headers = screen.getAllByRole("rowheader")
            expect(headers.length).toEqual(2)

            userEvent.selectOptions(screen.getByRole("combobox"),["10"]);
            expect(screen.getByRole("option",{name:"10"}).ariaSelected);
            }
        )

    })
    
    
    test("Scomparsa del lampione dopo cancellazione", async () => {
        mockedAxios.get.mockResolvedValue({
            data: { 
                    id: 1,
                    nome: "test",
                    descrizione: "test",
                    latitudine: "test",
                    longitudine: "test",
                    lampioni: [
                        {
                            id: 1,
                            stato: "test",
                            lum: 5,
                            luogo: "test",
                            area: 1,
                            guasto:false
                        }
                    ],
                    sensori: []
                }
        })
    
        mockedAxios.delete.mockResolvedValue("OK")

        render(
                <ConfirmProvider>
                    <MemoryRouter initialEntries={["/tests"]}>
                        <Routes>
                            <Route path="/:areaId" element={<AreaSingleView/>} />
                        </Routes>
                    </MemoryRouter>
                </ConfirmProvider>
            
        )
        
        
        let button: HTMLElement | null = null
        await waitFor(() => {
                button = screen.getByText("Elimina",{selector:"button"})
        })
        let header = await screen.findAllByRole("rowheader")        
        expect(header.length).toEqual(1)

        userEvent.click(button!)
        const ok = await screen.findByText("OK",{selector:"button"});
        userEvent.click(ok)
        
        let head = await screen.queryByRole("rowheader")        
        expect(head).toBeNull()
        
    })
    
    
    test("Scomparsa del sensore dopo cancellazione", async () => {
        mockedAxios.get.mockResolvedValue({
            data: { 
                    id: 1,
                    nome: "test",
                    descrizione: "test",
                    latitudine: "test",
                    longitudine: "test",
                    polling: 10,
                    lampioni: [],
                    sensori: [
                        {
                            id: 1,
                            iter: "manuale",
                            IP: "1.1.1.1",
                            luogo: "test",
                            raggio: 10,
                            area: 1
                        }
                    ]
                }
        })
    
        mockedAxios.delete.mockResolvedValue("OK")

        render(
            <ConfirmProvider>
                <MemoryRouter initialEntries={["/tests"]}>
                    <Routes>
                        <Route path="/:areaId" element={<AreaSingleView/>} />
                    </Routes>
                </MemoryRouter>
            </ConfirmProvider>
            
        )
        
        let button: HTMLElement | null = null
        await waitFor(() => {
                button = screen.getByText("Elimina",{selector:"button"})
        })

        let headers = await screen.findAllByRole("rowheader")        
        expect(headers.length).toEqual(1)

        userEvent.click(button!)
        const ok = await screen.findByText("OK",{selector:"button"});
        userEvent.click(ok)

        let head = await screen.queryByRole("rowheader")        
        expect(head).toBeNull()

    })
    
})