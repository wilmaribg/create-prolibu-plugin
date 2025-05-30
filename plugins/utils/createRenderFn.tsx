import React from "react";
import { createRoot } from "react-dom/client";

export const createRenderFn = (Component: React.FC) => {
  return (node: HTMLElement, opts = {}) => {
    const root = createRoot(node);
    root.render(<Component />);
  };
};
