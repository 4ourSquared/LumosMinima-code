import { render, screen } from "@testing-library/react";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";
import '@testing-library/jest-dom'
import Content from "../Content";
import { Role } from "../../auth/Authorization";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockUserData = { role: Role.Amministratore };
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useOutletContext: () => mockUserData,
}));

test("Render della pagina 'Content' dove 'AreaTable' è vuota", async () => {
  
  const mockResponseData = [{ id: 1, nome: "Area 1", descrizione: "Descrizione 1", latitudine: 123, longitudine: 456 }];
  mockedAxios.get.mockResolvedValue({ data: mockResponseData });


  render(
    <Router>
      <Content />
    </Router>
  );

  await screen.findByText(/Aree illuminate/i);
  const title = screen.getByText(/Aree illuminate/i);

  const table = screen.getByRole("table");
  expect(table).toBeInTheDocument();
  expect(title).toBeInTheDocument();

  expect(mockedAxios.get).toHaveBeenCalled();
});