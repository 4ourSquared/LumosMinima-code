import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import EditForm from "../EditForm";

describe("EditForm", () => {
  it("should render correctly", () => {
    const { container } = render(<EditForm />);
    expect(container).toMatchSnapshot();
  });
  it("should submit correctly", () => {
    const luogoInput = screen.getByLabelText("Luogo di Installazione");
    const submitButton = screen.getByText("Crea");
    fireEvent.change(luogoInput, { target: { value: "Test" } });
    fireEvent.click(submitButton);
    // Check that the form was submitted correctly
  });
});
