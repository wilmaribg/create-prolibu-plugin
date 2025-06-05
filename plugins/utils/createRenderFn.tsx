// import path from "path";
// import webpack from "webpack";
// import { fileURLToPath } from "url";
// import WebpackDevServer from "webpack-dev-server";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const currentPath = path.resolve(process.cwd());
// // console.log("roge currentPath ---->", currentPath);

import React from "react";
import ReactDOM from "react-dom/client";
import { PluginContext } from "../types";

const cloneDeep = (obj: any) => {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (error) {
    return obj; // Fallback to returning the original object
  }
};

const drawComponent = (
  Component: any,
  node: HTMLElement,
  opts = {} as any,
  mode = "prod"
) => {
  // console.log("roge drawComponent ---->", { Component, node, opts, mode });
  // console.log("roge createRenderFn opts ---->", opts);
  const { shadowRoot, styleSheet } = opts || ({} as any);
  const { doc, configNodeId, pluginLibrary, preferences, comCompConfig } =
    cloneDeep(opts || {});

  const root = ReactDOM.createRoot(node);
  root.render(
    <Component
      ctx={{
        doc,
        shadowRoot,
        styleSheet,
        preferences,
        configNodeId,
        pluginLibrary,
        formSchemaModel: {
          ...comCompConfig?.model,
          language: comCompConfig?.language,
        },
      }}
    />
  );
};

export const createRenderFn = (Component: any) => {
  return (node: HTMLElement, opts = {} as any, mode = "prod") => {
    if (mode === "dev") return Component;
    const draw = (attemps: number) => {
      if (attemps > 10) {
        console.error("Failed to render component after multiple attempts.");
        return;
      }
      attemps++;
      if (typeof ReactDOM.createRoot === "function") {
        drawComponent(Component, node, opts, mode);
      } else {
        setTimeout(() => draw(attemps), 100);
      }
    };
    draw(0);
  };
};
