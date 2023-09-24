import { render, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom'
import App from "./App";
import ReactDOM from "react-dom";
import axios from "axios";

test("should render without crashing", () => {
    const div = document.createElement("div");
    div.id = "root";
    document.body.appendChild(div);
    require("./index.tsx");
    expect(ReactDOM.render(<App />,div)).toHaveBeenCalled();
  });