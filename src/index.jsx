import { createRoot } from "react-dom/client";
import { DndProvider } from "react-dnd";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { MultiBackend, getBackendOptions } from "@minoru/react-dnd-treeview";
import { theme } from "./theme";
import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <DndProvider backend={MultiBackend} options={getBackendOptions()}>
      <App />
    </DndProvider>
  </ThemeProvider>
);
