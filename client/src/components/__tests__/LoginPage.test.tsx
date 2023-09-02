import { render, screen } from "@testing-library/react";
import LoginPage from "../LoginPage";
import { BrowserRouter as Router } from "react-router-dom";

test("Render della pagina di login", () => {
    render(
    <Router>
        <LoginPage />
    </Router>
    );

    const title = screen.getByText(/Login/i);
    const usernameInput = screen.getByLabelText("Nome utente");
    const passwordInput = screen.getByLabelText("Password");

    expect(title).toBeInTheDocument();
    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
});