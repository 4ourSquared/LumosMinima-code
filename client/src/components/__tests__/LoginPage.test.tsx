import { render, screen } from "@testing-library/react";
import LoginPage from "../LoginPage";
import { BrowserRouter as Router } from "react-router-dom";
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

test("Click sul pulsante Entra", async () => {
    render(
        <Router>
            <LoginPage />
        </Router>
    )

    await userEvent.click(screen.getByRole('button'));
    //expect(screen.getByText(/Aree illuminate/i)).toBeInTheDocument();
})