import { render, screen, waitFor } from "@testing-library/react";
import {MemoryRouter,Routes,Route} from 'react-router-dom'
import SensorSingleView from "../SensorSingleView";
import axios from 'axios'

jest.mock("axios")
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Test del modulo SensorSingleView", () => {
    test("Test della funzione load", async () => {

        mockedAxios.get.mockResolvedValue({
            data: {
                id: 1,
                iter: "test",
                IP: "test",
                luogo: "test",
                raggio: 1,
                area: 1
            }
        })

        render(
            <MemoryRouter initialEntries={["/"]}>
                <Routes>
                    <Route path="/" element={<SensorSingleView areaId={1} sensoreId={1}/>} />
                </Routes>
            </MemoryRouter>
        )

        await waitFor(() => {
            const title = screen.getByText("Info sul sensore 1")
            expect(title).not.toBeNull()
        })
    })
})