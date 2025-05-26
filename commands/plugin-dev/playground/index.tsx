import React, { createContext } from "react";
import { createRoot } from "react-dom/client";
import { Main } from "./Main";

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);

// (function waitForReact() {
//   if (typeof React === "undefined" || typeof ReactDOM === "undefined") {
//     setTimeout(waitForReact, 50);
//   } else {
//   }
// })();
