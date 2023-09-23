import { act, render, renderHook, fireEvent, screen, waitFor, getByTestId, queryByTestId, getByPlaceholderText } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom'
import axios from "axios";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import NewAreaForm from "../NewAreaForm";
import React from "react";
import { getValue } from "@testing-library/user-event/dist/utils";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

test("Render della pagina NewAreaForm", async () => {

    mockedAxios.post.mockResolvedValue({
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

    render(
        <MemoryRouter initialEntries={["/"]}>
            <Routes>
                <Route path="/" element={<NewAreaForm/>} />
            </Routes>
        </MemoryRouter>
    );
    
    await waitFor(async()=>{
        expect(screen.findAllByRole('textbox'));
        
        const nome = screen.getByTestId("nome");
        fireEvent.change(nome, { target: { value: "test" } });

        const button = screen.getByText("Aggiungi");
        fireEvent.click(button);
    })
})