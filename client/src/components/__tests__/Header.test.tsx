import Header from "../Header"
import {MemoryRouter,Routes,Route} from 'react-router-dom'
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as module from "../../auth/LogoutMechanism"

describe("Test del modulo Header", () => {
    test("Logout", async () => {

    //mock della funzione che dovrebbe essere restituita dallo hook
    const mockLogout = jest.fn(async () => true)

    //mock dell'implementazione dello hook
    jest.spyOn(module, 'default').mockImplementation(() => mockLogout);
    render(
        
        <MemoryRouter initialEntries={["/"]}>
            <Routes>
                <Route path="/" element={<Header/>} />
            </Routes>
        </MemoryRouter>
        
    )
    
    
     const button = await screen.findByText("Esci")
     userEvent.click(button)
     

     expect(mockLogout).toHaveBeenCalledTimes(1)         


    })
})
test("Render del footer", async () => {
    render(
        <MemoryRouter>
            <Header />
        </MemoryRouter>
    );

    const nome = screen.getByText(/Lumos Minima/i);
    const breadcrumb = screen.getByText(/Home/i);

    expect(nome).toBeInTheDocument();
    expect(breadcrumb).toBeInTheDocument();

});