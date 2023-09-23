import { act, render, renderHook, fireEvent, screen, waitFor, getByTestId, queryByTestId, getByPlaceholderText } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom'
import axios from "axios";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import NewAreaForm from "../NewAreaForm";
import React from "react";
import { getValue } from "@testing-library/user-event/dist/utils";


test("Render della pagina NewAreaForm", async () => {
    const onSubmit = jest.fn();

    render(
        <MemoryRouter initialEntries={["/"]}>
            <Routes>
                <Route path="/" element={<NewAreaForm/>} />
            </Routes>
        </MemoryRouter>
    );
    
    await act(async()=>{
        expect(screen.findAllByRole('textbox'));
        
        const nome = screen.getByTestId("nome");
        fireEvent.change(nome, { target: { value: "test" } });
        const descrizione = screen.getByTestId("descrizione");
        fireEvent.change(descrizione, { target: { value: "test" } });
        const latitudine = screen.getByTestId("latitudine");
        fireEvent.change(latitudine, { target: { value: "1.1" } });
        const longitudine = screen.getByTestId("longitudine");
        fireEvent.change(longitudine, { target: { value: "1.1" } });
        const polling = screen.getByTestId("polling");
        fireEvent.change(polling, { target: { value: "20" } });

        const button = screen.getByText("Aggiungi");
        fireEvent.click(button);
        expect(onSubmit).toHaveBeenCalled();
    })
})
