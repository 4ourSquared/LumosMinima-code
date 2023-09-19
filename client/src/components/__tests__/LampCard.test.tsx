import { render, screen } from "@testing-library/react";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";
import { LampCard } from "../LampCard";

test("render di LampCard", () => {
    render(
        <LampCard />
    )

    expect(screen.getByRole("img")).toBeInTheDocument();
});