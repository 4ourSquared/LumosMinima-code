import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {MemoryRouter,Routes,Route} from 'react-router-dom'
import axios from 'axios'
import { ConfirmProvider } from 'material-ui-confirm';
import { Role } from "../../auth/Authorization";
import LampTable from "../LampTable";

jest.mock("axios")
const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockUserData = { role: Role.Amministratore };
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

    await waitFor(() => {
        const rows = screen.getAllByRole("row");
        expect(rows.length).toEqual(4)
    })

    })

    test("Test pulsante Info", async () => {

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
            ]
        })

        render(
            <MemoryRouter initialEntries={["/"]}>
                <Routes>
                    <Route path="/" element={<LampTable areaId={1}/>} />
                </Routes>
            </MemoryRouter>
        );


        await waitFor(async () => {
            let button = screen.getByText("Info",{selector:"button"});
            userEvent.click(button!);
        })
    });

    test("Test pulsante Modifica", async () => {

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
            ]
        })

        render(
            <MemoryRouter initialEntries={["/"]}>
                <Routes>
                    <Route path="/" element={<LampTable areaId={1}/>} />
                </Routes>
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
            
            <ConfirmProvider>
                <MemoryRouter initialEntries={["/"]}>
                    <Routes>
                        <Route path="/" element={<LampTable areaId={1}/>} />
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
                    <ConfirmProvider>
                        <MemoryRouter initialEntries={["/"]}>
                            <Routes>
                                <Route path="/" element={<LampTable areaId={1}/>} />
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




    test("Test della segnalazione guasto", async () => {

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
            ]
        })

        render(
            
            <ConfirmProvider>
                <MemoryRouter initialEntries={["/"]}>
                    <Routes>
                        <Route path="/" element={<LampTable areaId={1}/>} />
                    </Routes>
                </MemoryRouter>
            </ConfirmProvider>
            
        )
        
        let button: Element | null = null
        await waitFor(async () => {
                button = screen.getByText("Segnala guasto",{selector:"button"})
        })
        
        userEvent.click(button!)
        const ok = await screen.findByText("OK",{selector:"button"});
        userEvent.click(ok)
            
    })

    test("Test click su Annulla al momento di conferma della segnalazione guasto", async () => {
            
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
                ]
            })

            render(
                    <ConfirmProvider>
                        <MemoryRouter initialEntries={["/"]}>
                            <Routes>
                                <Route path="/" element={<LampTable areaId={1}/>} />
                            </Routes>
                        </MemoryRouter>
                    </ConfirmProvider>
                
            )

            let button: Element | null = null
            await waitFor(async () => {
                button = screen.getByText("Segnala guasto",{selector:"button"})
            })

            userEvent.click(button!)
            const annulla = await screen.findByText("Annulla",{selector:"button"});
            userEvent.click(annulla)
    })
    
})