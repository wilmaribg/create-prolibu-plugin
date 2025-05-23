import React from "react";
import { createRoot } from "react-dom/client";
import DevPage from "@/src/pages/DevPage.tsx";
import "@/src/styles/globals.css";

const root = createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <DevPage />
  </React.StrictMode>
);
