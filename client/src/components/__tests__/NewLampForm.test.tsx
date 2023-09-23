import { act, render, renderHook, fireEvent, screen, waitFor, getByTestId, queryByTestId, getByPlaceholderText } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom'
import axios from "axios";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import NewLampForm from "../NewLampForm";
import React from "react";
import { getValue } from "@testing-library/user-event/dist/utils";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

test("Render della pagina NewLampForm", async () => {

    mockedAxios.post.mockResolvedValue({
        data: {
              id: 1,
              stato: "attivo",
              lum: 5,
              luogo: "test",
              area: 1,
              guasto: false,
              mode: "manuale",
        }
    });

    render(
        <MemoryRouter initialEntries={["/:areaId"]}>
            <Routes>
                <Route path="/:areaId" element={<NewLampForm areaId={1}/>} />
            </Routes>
        </MemoryRouter>
    );
    
    await waitFor(async()=>{
        expect(screen.findAllByRole('textbox'));
        
        const luogo = screen.getByTestId("luogo");
        fireEvent.change(luogo, { target: { value: "test" } });

        const button = screen.getByText("Crea");
        fireEvent.click(button);
    })
})