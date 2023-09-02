import { render, screen } from "@testing-library/react";
import LampSingleView from "../LampSingleView";
import RouterComponent from "../../routing/RouterComponent";

test("apre la pagina dedicata alla info del singolo lampione", () => {
  render(<LampSingleView areaId={1} lampioneId={1} />);
  const title = screen.getByText(/Info del lampione id: da passare/i);
  const id = screen.getByText(/ID: /i);
  const stato = screen.getByText(/Stato: /i);
  const lum = screen.getByText(/Luminosità: /i);
  const pos = screen.getByText(/Posizione: /i);

  expect(title).toBeInTheDocument();
  expect(id).toBeInTheDocument();
  expect(stato).toBeInTheDocument();
  expect(lum).toBeInTheDocument();
  expect(pos).toBeInTheDocument();
});
