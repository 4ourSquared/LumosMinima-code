import { render, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom'
import App from "./App";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

test("Renderizza la pagina principale", async () => {

  mockedAxios.put.mockResolvedValue({
    status: 200,
  });

  render(<App />);

  await waitFor(()=> {
    expect(screen.getByText(/Lumos Minima/i)).toBeInTheDocument();
  })
});
