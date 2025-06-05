import { SearchForm } from "@/components/search-form";
import { VersionSwitcher } from "@/components/version-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import { AppContext } from "@/Main";
import { getItemsFromComponents } from "@/lib/getItemsFromComponents";
import pluginsManifest from "$local/index.tsx";
import { useContext } from "react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // This is sample data.
  const data = {
    navMain: [
      {
        title: "Plugins",
        url: "#",
        items: [...getItemsFromComponents(pluginsManifest?.components || [])],
      },
    ],
  };

  const appContext = useContext<IAppStateType>(AppContext);

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher
          versions={[appContext.currentVersion]}
          defaultVersion={appContext.currentVersion}
        />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={appContext.currentPlugin?.title === item.title}
                      onClick={() => appContext.setCurrentPlugin(item)}
                      className="cursor-pointer"
                    >
                      <a href={void 0}>{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
