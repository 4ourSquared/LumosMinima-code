import { act, render, renderHook, fireEvent, screen, waitFor, getByTestId, queryByTestId, getByPlaceholderText } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom'
import axios from "axios";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import NewSensorForm from "../NewSensorForm";
import React from "react";
import { getValue } from "@testing-library/user-event/dist/utils";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

test("Render della pagina NewLampForm", async () => {

    mockedAxios.post.mockResolvedValue({
        data: {
            id: 1,
            IP: "1.1.1.1",
            luogo: "test",
            raggio: 10,
            area: 1,
            sig_time: 20,
        }
    });

    render(
        <MemoryRouter initialEntries={["/:areaId"]}>
            <Routes>
                <Route path="/:areaId" element={<NewSensorForm areaId={1}/>} />
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