import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AreaTable from "../AreaTable";
import {MemoryRouter,Routes,Route} from 'react-router-dom'
import axios from 'axios'
import { ConfirmProvider } from 'material-ui-confirm';

jest.mock("axios")
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Test del modulo AreaTable", () => {
    test("Test della funzione load", async () => {

    mockedAxios.get.mockResolvedValue({
        data: [
            { 
                id: 1,
                nome: "a1",
                descrizione: "d1",
                latitudine: "prova",
                longitudine: "prova",
                polling: 10,
                sensori: [],
                lampioni: []
            },
            { 
                id: 2,
                nome: "a2",
                descrizione: "d2",
                latitudine: "prova",
                longitudine: "prova",
                polling: 10,
                sensori: [],
                lampioni: []
            },
            { 
                id: 3,
                nome: "a3",
                descrizione: "d3",
                latitudine: "prova",
                longitudine: "prova",
                polling: 10,
                sensori: [],
                lampioni: []
            },
        ]
    })

    render(        
        <MemoryRouter initialEntries={["/"]}>
            <Routes>
                <Route path="/" element={<AreaTable/>} />
            </Routes>
        </MemoryRouter>
        
    )

    await waitFor(() => {
        const rows = screen.getAllByRole("row");
        expect(rows.length).toEqual(4)
    })

    })

    test("Test pulsante Modifica", async () => {

        mockedAxios.get.mockResolvedValue({
            data: [
                { 
                    id: 1,
                    nome: "test",
                    descrizione: "test",
                    latitudine: "1.1",
                    longitudine: "1.1",
                    polling: 10,
                    sensori: [],
                    lampioni: []
                },
            ]
        })

        render(
            <MemoryRouter>
                <AreaTable />
            </MemoryRouter>
        );


        await waitFor(async () => {
            let button = screen.getByText("Modifica",{selector:"button"});
            userEvent.click(button!);
        })
    });

    test("Test della cancellazione", async () => {

        mockedAxios.get.mockResolvedValue({
            data: [
                { 
                    id: 1,
                    nome: "test",
                    descrizione: "test",
                    latitudine: "1.1",
                    longitudine: "1.1",
                    polling: 10,
                    sensori: [],
                    lampioni: []
                },
            ]
        })

        render(
            
            <ConfirmProvider>
                <MemoryRouter initialEntries={["/"]}>
                    <Routes>
                        <Route path="/" element={<AreaTable/>} />
                    </Routes>
                </MemoryRouter>
            </ConfirmProvider>
            
        )
        
        let button: Element | null = null
        await waitFor(async () => {
                button = screen.getByText("Elimina",{selector:"button"})
        })
        
        userEvent.click(button!)
        const ok = await screen.findByText("OK",{selector:"button"});
        userEvent.click(ok)

        const rows = await screen.findAllByRole("row")
            
        expect(rows.length).toEqual(1)
            
    })

    test("Test click su Annulla al momento di conferma della cancellazione", async () => {
            
            mockedAxios.get.mockResolvedValue({
                data: [
                    { 
                        id: 1,
                        nome: "a1",
                        descrizione: "d1",
                        latitudine: "prova",
                        longitudine: "prova",
                        polling: 10,
                        sensori: [],
                        lampioni: []
                    }
                ]
            })

            render(
                    <ConfirmProvider>
                        <MemoryRouter initialEntries={["/"]}>
                            <Routes>
                                <Route path="/" element={<AreaTable/>} />
                            </Routes>
                        </MemoryRouter>
                    </ConfirmProvider>
                
            )

            let button: Element | null = null
            await waitFor(async () => {
                button = screen.getByText("Elimina",{selector:"button"})
            })

            userEvent.click(button!)
            const annulla = await screen.findByText("Annulla",{selector:"button"});
            userEvent.click(annulla)

            const rows = await screen.findAllByRole("row")
            
            expect(rows.length).toEqual(2)
    })
})





