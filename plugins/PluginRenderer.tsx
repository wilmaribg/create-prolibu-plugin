import { createRoot } from 'react-dom/client';
import { renderHtml } from 'utils/renderHmtl';
import pluginLists from './main';
import { createContext } from 'react';

export const ProlibuPluginContext = createContext({
  doc: {},
});

export const ProlibuPlugins = () => {};

ProlibuPlugins.renderAndHydrate = (plugin: ProlibuPlugin, payload: Record<string, any>) => {
  const comString = `<div id="${plugin.containerId}"></div>`;
  const html = renderHtml(payload.html, plugin.containerId, comString.toString());

  setTimeout(() => {
    const id = plugin.containerId;
    let element = payload.shadowRoot?.getElementById(id);
    if (!element) element = document.getElementById(id);
    if (!element) return;
    const root = createRoot(element);
    root.render(
      <ProlibuPluginContext.Provider value={{ doc: { ...payload } }}>
        <>{plugin.component}</>
      </ProlibuPluginContext.Provider>
    );
  });

  return html;
};

ProlibuPlugins.render = (payload: Record<string, any>) => {
  let pluginsHtml = '';
  const { plugins } = pluginLists;

  plugins.map((plugin: ProlibuPlugin) => {
    pluginsHtml += ProlibuPlugins.renderAndHydrate(plugin, payload);
  });

  return pluginsHtml;
};
