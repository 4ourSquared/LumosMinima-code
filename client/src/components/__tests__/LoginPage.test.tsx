/* eslint-disable testing-library/no-unnecessary-act */
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import LoginPage from "../LoginPage";

test("Render della pagina di login", () => {
  render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
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
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  );

  act(() => {
    userEvent.click(screen.getByRole("button"));
  });
});

test("Click sul pulsante Entra - admin", async () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </MemoryRouter>
  );

  act(() => {
    userEvent.type(screen.getByLabelText("Nome utente"), "admin");
    userEvent.type(screen.getByLabelText("Password"), "admin");
    userEvent.click(screen.getByRole("button"));
  });
});

test("Click sul pulsante Entra - manut", async () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </MemoryRouter>
  );

  act(() => {
    userEvent.type(screen.getByLabelText("Nome utente"), "manut");
    userEvent.type(screen.getByLabelText("Password"), "manut");
    userEvent.click(screen.getByRole("button"));
  });
});
