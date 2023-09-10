import { render, screen } from "@testing-library/react";
import Content from "../Content";
import { BrowserRouter as Router } from "react-router-dom";

test("Render della pagina 'Content' dove 'AreaTable' è vuota", () => {
    render(
        <Router>
            <Content />
        </Router>
    );

    const title = screen.getByText(/Aree illuminate/i);
    const button = screen.getByText(/Aggiungi Area/i);
    const table = screen.getByRole("table");

    expect(title).toBeInTheDocument();
    expect(button).toBeInTheDocument();
    expect(table).toBeInTheDocument();
}); 