import { render, screen } from "@testing-library/react";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";
import Content from "../Content";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.get.mockResolvedValue([]);

test("Render della pagina 'Content' dove 'AreaTable' è vuota", async () => {
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
