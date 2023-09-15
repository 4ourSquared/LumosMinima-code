import { act, render, renderHook, fireEvent, screen, waitFor, getByTestId, queryByTestId, getByPlaceholderText } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AreaSingleView from "../AreaSingleView";
import React from "react";
import { getValue } from "@testing-library/user-event/dist/utils";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

test("fetch dei dati", async () => {

    mockedAxios.get.mockResolvedValue({
        data: {
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
    });

    mockedAxios.put.mockResolvedValue({
        status: 200,
    });

    const{getByText} = render(
    <MemoryRouter initialEntries={["/:areaId"]}>
        <Routes>
            <Route path="/:areaId" element={<AreaSingleView />} />
        </Routes>
    </MemoryRouter>
    );

    expect(getByText("Caricamento...")).toBeInTheDocument();
    await waitFor(()=>{
        fireEvent.click(screen.getByRole("combobox"));
        fireEvent.change(screen.getByRole("combobox"), {target: {value: 10}});
    })
});


test("errore nel fetch dei dati", async () => {

    const{getByText} = render(
    <MemoryRouter initialEntries={["/:areaId"]}>
        <Routes>
            <Route path="/:areaId" element={<AreaSingleView />} />
        </Routes>
    </MemoryRouter>
    );

    expect(getByText("Caricamento...")).toBeInTheDocument();
});
