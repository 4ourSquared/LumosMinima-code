import { fireEvent, render, screen, waitFor, act, getByTitle } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { Role } from "../../auth/Authorization";
import AreaSingleView from "../AreaSingleView";
import { ConfirmProvider } from "material-ui-confirm";
import '@testing-library/jest-dom/extend-expect'

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockUserData = { role: Role.Amministratore };
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useOutletContext: () => mockUserData,
}));

describe("Test del modulo AreaSingleView", () => {
    test("Test del fetch", async () => {
        mockedAxios.get.mockResolvedValue({
            data: {
                id: 1,
                nome: "test",
                descrizione: "test",
                latitudine: "1.1",
                longitudine: "1.1",
                polling: 10,
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
                    {
                        id: 2,
                        stato: "attivo",
                        lum: 5,
                        luogo: "test2",
                        area: 1,
                        guasto: false,
                        mode: "manuale",
                    },
                ],
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
            },
        });

        mockedAxios.get.mockResolvedValue({
            data: [{
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
                luogo: "test2",
                area: 1,
                guasto: false,
                mode: "manuale",
            },
        ],
        });

        mockedAxios.put.mockResolvedValue({
            status: 200,
        });

        
        const { getByText } = render(
            <MemoryRouter initialEntries={["/tests"]}>
                <Routes>
                    <Route path="/:areaId" element={<AreaSingleView />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(getByText("ID:")).toBeInTheDocument();
        });
    });

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
                        guasto: false,
                    },
                ],
                sensori: [],
            },
        });

        mockedAxios.delete.mockResolvedValue("OK");

        render(
            <ConfirmProvider>
                <MemoryRouter initialEntries={["/tests"]}>
                    <Routes>
                        <Route path="/:areaId" element={<AreaSingleView />} />
                    </Routes>
                </MemoryRouter>
            </ConfirmProvider>
        );

        await waitFor(async () => {
            act(async () => {
            let button = screen.getByText("Elimina", { selector: "button" });
            userEvent.click(button!);
            const ok = await screen.findByText("OK", { selector: "button" });
            userEvent.click(ok);
            const rows = await screen.findAllByRole("row");
            expect(rows.length).toEqual(1);
            });
        });

    });

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
                        area: 1,
                    },
                ],
            },
        });

        mockedAxios.delete.mockResolvedValue("OK");

        render(
            <ConfirmProvider>
                <MemoryRouter initialEntries={["/tests"]}>
                    <Routes>
                        <Route path="/:areaId" element={<AreaSingleView />} />
                    </Routes>
                </MemoryRouter>
            </ConfirmProvider>
        );

        await waitFor(async () => {
            act(async () => {
            let button = screen.getByText("Elimina", { selector: "button" });
            userEvent.click(button!);
            const ok = await screen.findByText("OK", { selector: "button" });
            userEvent.click(ok);
            const rows = await screen.findAllByRole("row");
            expect(rows.length).toEqual(1);
            });
        });

    });

    test("should send a request when the select value changes", async () => {
        // Configura un mock di axios per simulare una risposta positiva
        mockedAxios.put.mockResolvedValue({status: 200});
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
                        guasto: false,
                    },
                ],
                sensori: [],
            },
        });

        render(<ConfirmProvider>
            <MemoryRouter initialEntries={["/1"]}>
                <Routes>
                    <Route path="/:areaId" element={<AreaSingleView />} />
                </Routes>
            </MemoryRouter>
        </ConfirmProvider>);

        
        // Attendi che il componente gestisca la risposta
        await screen.findByRole("select");
        act( () => {
        // Simula un cambiamento di valore nel <select>
        fireEvent.change(screen.getByRole("select"), {
            target: { value: "3" },
        });

        // Verifica che axios.put sia stato chiamato con i parametri corretti
        expect(axios.put).toHaveBeenCalled();
    });
    });
});
