import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AreaSingleView from "../AreaSingleView";
import {MemoryRouter,Routes,Route} from 'react-router-dom'
import axios from 'axios'
import { ConfirmProvider } from 'material-ui-confirm';
import AreaItem from "../../types/AreaItem";

const mockData = [
    { 
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
]

test("Test del fetch", async () => {
    render(
        <MemoryRouter initialEntries={["/tests"]}>
            <Routes>
                <Route path="/:areaId" element={<AreaSingleView/>} />
            </Routes>
        </MemoryRouter>
        
    )
})

/*
jest.mock("axios")
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Test del modulo AreaSingleView", () => {

    test("Test del fetch", async () => {
        //mock in beforeAll() non funziona, problema già documentato
        mockedAxios.get.mockResolvedValue({
            data: [
                { 
                    id: 1,
                    nome: "test",
                    descrizione: "test",
                    latitudine: "test",
                    longitudine: "test",
                    sensori: [
                        {
                            id: 1,
                            iter: "manuale",
                            IP: "1.1.1.1",
                            luogo: "test",
                            raggio: 10,
                            area: 1
                        }
                    ],
                    lampioni: [
                        {
                            id: 1,
                            stato: "test",
                            lum: 5,
                            luogo: "test",
                            area: 1,
                            guasto:false
                        }
                    ]
                }
            ]
        })
    
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
            }
        )

    })
    
    /*
    test("Scomparsa del lampione dopo cancellazione", async () => {
        mockedAxios.get.mockResolvedValue({
            data: [
                { 
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
            ]
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
        
        userEvent.click(button!)
        const ok = await screen.findByText("OK",{selector:"button"});
        userEvent.click(ok)

        const headers = await screen.findAllByRole("rowheader")        
        expect(headers.length).toEqual(1)
    })
    
    
    test("Scomparsa del sensore dopo cancellazione", async () => {
        mockedAxios.get.mockResolvedValue({
            data: [
                { 
                    id: 1,
                    nome: "aaaa",
                    descrizione: "test",
                    latitudine: "test",
                    longitudine: "test",
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
            ]
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
                //button = screen.getAllByText("Elimina",{selector:"button"}).at(0)!
                button = screen.getByText("Elimina",{selector:"button"})
        })
        
        userEvent.click(button!)
        const ok = await screen.findByText("OK",{selector:"button"});
        userEvent.click(ok)

        const headers = await screen.findAllByRole("rowheader")        
        expect(headers.length).toEqual(1)
    })
    
})*/