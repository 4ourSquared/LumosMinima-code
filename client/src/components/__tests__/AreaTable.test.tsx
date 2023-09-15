import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AreaItem from "../../types/AreaItem";
import AreaTable from "../AreaTable";
import {MemoryRouter,Routes,Route} from 'react-router-dom'
import axios from 'axios'
import { ConfirmProvider } from 'material-ui-confirm';

jest.mock("axios")
const mockedAxios = axios as jest.Mocked<typeof axios>;

test("Render della pagina di AreaTable", async () => {

    mockedAxios.get.mockResolvedValue({
        data: [
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
                        sig_time: 20,
                    },
                ],
                lampioni: [
                    {
                        id: 1,
                        stato: "attivo",
                        lum: 5,
                        luogo: "test",
                        area: 1,
                        guasto: false,
                        mode: "manuale",
                    },
                ],
            },
            { 
                id: 2,
                nome: "test",
                descrizione: "test",
                latitudine: "2.2",
                longitudine: "2.2",
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

    await waitFor(() => {
        const rows = screen.getAllByRole("row");
        expect(rows.length).toEqual(3)
    })
});

test("Test pulsante Informazioni", async () => {

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
        let button = screen.getByText("Informazioni",{selector:"button"});
        userEvent.click(button!);
    })
});

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
            <MemoryRouter>
                <AreaTable />
            </MemoryRouter>
        </ConfirmProvider>
    );


    await waitFor(async () => {
        let button = screen.getByText("Elimina",{selector:"button"});
        userEvent.click(button!);
        const ok = await screen.findByText("OK",{selector:"button"});
        userEvent.click(ok);
        const rows = await screen.findAllByRole("row");
        expect(rows.length).toEqual(1);
    })
});

test("Test click su Annulla al momento di conferma della cancellazione", async () => {

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
            <MemoryRouter>
                <AreaTable />
            </MemoryRouter>
        </ConfirmProvider>
    );


    await waitFor(async () => {
        let button = screen.getByText("Elimina",{selector:"button"});
        userEvent.click(button!);
        const ok = await screen.findByText("Annulla",{selector:"button"});
        userEvent.click(ok);
        const rows = await screen.findAllByRole("row");
        expect(rows.length).toEqual(2);
    })
});