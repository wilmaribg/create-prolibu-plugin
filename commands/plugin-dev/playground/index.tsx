import React from "react";
import { createRoot } from "react-dom/client";
import { MainLayout } from "@plugin/layouts/MainLayout.tsx";

const root = createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <MainLayout />
  </React.StrictMode>
);
