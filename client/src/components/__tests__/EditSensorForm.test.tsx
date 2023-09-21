import { act, render, renderHook, fireEvent, screen, waitFor, getByTestId, queryByTestId, getByPlaceholderText } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom'
import axios from "axios";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import EditSensorForm from "../EditSensorForm";
import React from "react";
import { getValue } from "@testing-library/user-event/dist/utils";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

test("Render della pagina EditSensorForm", async () => {
    
        mockedAxios.get.mockResolvedValue({
            data: {
                id: 1,
                IP: "125.125.125.125",
                luogo: "test",
                raggio: 10,
                area: 1,
                sig_time: 20,
            },
        });

        const {getByText} = render(
            <MemoryRouter initialEntries={["/:areaId/sensori/:sensoreId"]}>
                <Routes>
                    <Route path="/:areaId/sensori/:sensoreId" element={<EditSensorForm areaId={1} sensoreId={1}/>} />
                </Routes>
            </MemoryRouter>
        );
})