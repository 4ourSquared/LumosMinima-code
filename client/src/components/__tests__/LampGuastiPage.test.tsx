import LampGuastiPage from "../LampGuastiPage"
import {MemoryRouter,Routes,Route} from 'react-router-dom'
import { render, screen, waitFor } from "@testing-library/react";

test("Render della pagina dei guasti", async () => {
    

    render(
        <MemoryRouter initialEntries={["/"]}>
            <Routes>
                <Route path="/" element={<LampGuastiPage areaId={1}/>} />
            </Routes>
        </MemoryRouter>
    )

    expect(screen.getByText("Lista degli impianti luminosi guasti")).toBeInTheDocument();
})