import React, { createRef } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { SnackbarProvider } from "notistack";

const notistackRef = createRef();

ReactDOM.render(
  <SnackbarProvider
    ref={notistackRef}
    maxSnack={1}
    anchorOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    autoHideDuration={2000}
  >
    <App />
  </SnackbarProvider>,
  document.getElementById("root")
);
