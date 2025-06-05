import React, { createContext, useState } from "react";
import DevPage from "@/src/pages/DevPage.tsx";
import "@/src/styles/globals.css";
import pluginsManifest from "$local/index.tsx";
import { getItemsFromComponents } from "@/lib/getItemsFromComponents";

declare global {
  interface IAppStateType {
    currentVersion: string;
    currentPlugin?: Record<string, any>;
    setCurrentPlugin: (plugin: any) => void;
  }
}

const AppState = {
  currentVersion: "1.0.1",
  currentPlugin: undefined,
  setCurrentPlugin: (plugin: any) => {
    AppState.currentPlugin = plugin;
  },
} satisfies IAppStateType;

export const AppContext = createContext({ ...AppState });

export const Main = () => {
  const currentVersion = "1.0.1";
  const [currentPlugin, setCurrentPlugin] = useState(
    getItemsFromComponents(pluginsManifest?.components || [])[0]
  );

  return (
    <AppContext.Provider
      value={{ currentVersion, currentPlugin, setCurrentPlugin }}
    >
      <DevPage />
    </AppContext.Provider>
  );
};
