import LampGuastiPage from "../LampGuastiPage"
import {MemoryRouter,Routes,Route} from 'react-router-dom'
import { render, screen, waitFor } from "@testing-library/react";


describe("Test del modulo LampGuastiPage", () => {
    test("Verifica se sono presenti header,LampGuastiTable,footer", async () => {
        
        render(
            <MemoryRouter initialEntries={["/"]}>
                <Routes>
                    <Route path="/" element={<LampGuastiPage areaId={1}/>} />
                </Routes>
            </MemoryRouter>
        )
    })
})