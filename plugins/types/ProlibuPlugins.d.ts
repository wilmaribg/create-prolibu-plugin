import React from "react";

export interface ProlibuPlugin {
  label: string;
  icon?: string;
  active?: boolean;
  containerId: string;
  description?: string;
  component: React.ComponentType<any>;
  settings?: Record<string, any>;
}

export interface ProlibuPluginsConfig {
  plugins: ProlibuPlugin[];
}

declare global {
  ProlibuPlugin;
  ProlibuPluginsConfig;
}

export {}; // necesario para que TypeScript trate este archivo como un módulo
