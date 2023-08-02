import { render, screen } from "@testing-library/react";
import App from "./App";

test("Renderizza la pagina principale", () => {
  render(<App />);
  const linkElement = screen.getByText(/Lumos Minima/i);
  expect(linkElement).toBeInTheDocument();
});
