import { render, screen } from "@testing-library/react";
import Footer from "../Footer";
import { BrowserRouter as Router } from "react-router-dom";

test("Render del footer", () => {
    render(
            <Footer />
    );

    const riga1 = screen.getByText(/4ourSquared Team/i);
    const riga2 = screen.getByText(/Università degli Studi di Padova/i);
    const riga3 = screen.getByText(/Progetto Didattico di SWE/i);

    expect(riga1).toBeInTheDocument();
    expect(riga2).toBeInTheDocument();
    expect(riga3).toBeInTheDocument();

});