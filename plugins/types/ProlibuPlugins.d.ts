import React from "react";

type ProlibuPluginContext = (
  node: HTMLElement,
  opts?: Record<string, any>
) => void;
export interface ProlibuComponent {
  label: string;
  icon?: string;
  active?: boolean;
  containerId: string;
  description?: string;
  render: ProlibuPluginContext;
  settings?: Record<string, any>;
}

export interface ProlibuPluginsConfig {
  components: ProlibuComponent[];
}

declare global {
  ProlibuPlugin;
  ProlibuPluginsConfig;
}

export {}; // necesario para que TypeScript trate este archivo como un módulo
