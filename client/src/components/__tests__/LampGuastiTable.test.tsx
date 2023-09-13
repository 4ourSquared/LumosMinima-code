import { render, screen, waitFor } from "@testing-library/react";
import {MemoryRouter,Routes,Route} from 'react-router-dom'
import LampGuastiTable from "../LampGuastiTable";
import axios from 'axios'
import AreaSingleView from "../AreaSingleView";
import { ConfirmProvider } from "material-ui-confirm";

import LampGuastiPage from "../LampGuastiPage";


jest.mock("axios")
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Test del modulo LampGuastiTable", () => {
    test("Test della funzione load", async () => {

            mockedAxios.get.mockResolvedValue({ 
                data:[
                {
                    id: 1,
                    stato: "test",
                    lum: 5,
                    luogo: "test",
                    area: 1,
                    guasto:true
                },
                {
                    id: 2,
                    stato: "test",
                    lum: 5,
                    luogo: "test",
                    area: 1,
                    guasto:true
                },
                {
                    id: 3,
                    stato: "test",
                    lum: 5,
                    luogo: "test",
                    area: 1,
                    guasto:true
                }
            ]})

            render(
                <MemoryRouter initialEntries={["/"]}>
                    <Routes>
                        <Route path="/" element={<LampGuastiTable areaId={0}/>}/>
                    </Routes>
                </MemoryRouter>
            )

            await waitFor(() => {
                const rows = screen.getAllByRole("row");
                expect(rows.length).toEqual(4)
            })

    })

    test("Test della funzione remove", async () => {

        mockedAxios.get.mockResolvedValue({ 
            data:[
            {
                id: 1,
                stato: "test",
                lum: 5,
                luogo: "test",
                area: 1,
                guasto:true
            }
        ]})
    
        mockedAxios.delete.mockResolvedValue("OK")

        render(
                <ConfirmProvider>
                    <MemoryRouter initialEntries={["/tests"]}>
                        <Routes>
                            <Route path="/:areaId" element={<AreaSingleView/>} />
                        </Routes>
                    </MemoryRouter>
                </ConfirmProvider>
            
        )
        
        
        let button: HTMLElement | null = null
        await waitFor(() => {
                button = screen.getByText("Elimina",{selector:"button"})
        })
        let header = await screen.findAllByRole("rowheader")        
        expect(header.length).toEqual(1)

        userEvent.click(button!)
        const ok = await screen.findByText("OK",{selector:"button"});
        userEvent.click(ok)
        
        let head = await screen.queryByRole("rowheader")        
        expect(head).toBeNull()
    })

    test("Test click su Annulla al momento di conferma della rimozione della lista", async () => {

    })
})