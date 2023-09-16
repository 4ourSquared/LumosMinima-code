import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LampItem from "../../types/LampItem";
import LampGuastiTable from "../LampGuastiTable";
import {MemoryRouter,Routes,Route} from 'react-router-dom'
import axios from 'axios'
import { ConfirmProvider } from 'material-ui-confirm';

jest.mock("axios")
const mockedAxios = axios as jest.Mocked<typeof axios>;

test("Render della pagina di LampGuastiTable", async () => {

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
      <MemoryRouter>
        <LampGuastiTable areaId={1} />
      </MemoryRouter>
    );

    await waitFor(() => {
        const rows = screen.getAllByRole("row");
        expect(rows.length).toEqual(2);
    })
});

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
        <MemoryRouter>
            <LampGuastiTable areaId={1}/>
        </MemoryRouter>
    );


    await waitFor(async () => {
        let button = screen.getByText("Info",{selector:"button"});
        userEvent.click(button!);
    })
});

test("Test della rimozione", async () => {

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
            <MemoryRouter>
                <LampGuastiTable areaId={1}/>
            </MemoryRouter>
        </ConfirmProvider>
    );


    await waitFor(async () => {
        let button = screen.getByText("Marca come riparato",{selector:"button"});
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
            <MemoryRouter>
                <LampGuastiTable areaId={1}/>
            </MemoryRouter>
        </ConfirmProvider>
    );

    await waitFor(async () => {
        let button = screen.getByText("Marca come riparato",{selector:"button"});
        userEvent.click(button!);
        const ok = await screen.findByText("Annulla",{selector:"button"});
        userEvent.click(ok);
        const rows = await screen.findAllByRole("row");
        expect(rows.length).toEqual(2);
    })
});