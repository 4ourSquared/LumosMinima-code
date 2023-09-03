import { render, screen } from "@testing-library/react";
import LoginPage from "../LoginPage";
import { MemoryRouter, BrowserRouter as Router, Routes, Route } from "react-router-dom";
import userEvent from "@testing-library/user-event";

test("Render della pagina di login", () => {
    render(
    <Router>
        <LoginPage />
    </Router>
    );

    const title = screen.getByText(/Lumos Minima/i);
    const usernameInput = screen.getByLabelText("Nome utente");
    const passwordInput = screen.getByLabelText("Password");

    expect(title).toBeInTheDocument();
    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
});

test("Click sul pulsante Entra - campi errati", () => {
    render(
        <Router>
            <LoginPage />
        </Router>
    );

    userEvent.click(screen.getByRole('button'));
})

test("Click sul pulsante Entra - admin", async () => {
    render(
        <MemoryRouter initialEntries={["/"]}>
            <Routes>
                <Route path="/" element={<LoginPage />}/>
            </Routes>
        </MemoryRouter>
    )

    userEvent.type(screen.getByLabelText("Nome utente"),"admin");
    userEvent.type(screen.getByLabelText("Password"),"admin");
    userEvent.click(screen.getByRole('button'));
})

test("Click sul pulsante Entra - manut", async () => {
    render(
        <MemoryRouter initialEntries={["/"]}>
            <Routes>
                <Route path="/" element={<LoginPage />}/>
            </Routes>
        </MemoryRouter>
    )

    userEvent.type(screen.getByLabelText("Nome utente"),"manut");
    userEvent.type(screen.getByLabelText("Password"),"manut");
    userEvent.click(screen.getByRole('button'));
})