import { act, render, renderHook, fireEvent, screen, waitFor, getByTestId, queryByTestId, getByPlaceholderText } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom'
import axios from "axios";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import EditLampForm from "../EditLampForm";
import React from "react";
import { getValue } from "@testing-library/user-event/dist/utils";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

test("Render della pagina EditLampForm", async () => {

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
    });

    const {getByText} = render(
        <MemoryRouter initialEntries={["/:areaId/lampioni/:lampioneId"]}>
            <Routes>
                <Route path="/:areaId/lampioni/:lampioneId" element={<EditLampForm areaId={1} lampioneId={1}/>} />
            </Routes>
        </MemoryRouter>
    );

    expect(getByText("Loading...")).toBeInTheDocument();
    await waitFor(async ()=>{
        expect(screen.findAllByRole('textbox'));

        const nome = screen.getByTestId("luogo");
        fireEvent.change(nome, { target: { value: "t" } });

        const button = screen.getByText("Modifica");
        fireEvent.click(button);
        await act(() => {
          expect(screen.getByText("Inserisci almeno 2 caratteri"))
        });

        const mockedDateField = screen.getByTestId("luogo");
        fireEvent.change(mockedDateField, { target: { value: "tset" } });

        fireEvent.click(button);
    })

})