import Header from "../Header"
import {MemoryRouter,Routes,Route} from 'react-router-dom'
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as module from "../../auth/LogoutMechanism"

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

    await waitFor(async () => {
        const button = await screen.findByText("Esci")
        userEvent.click(button)
    })
});