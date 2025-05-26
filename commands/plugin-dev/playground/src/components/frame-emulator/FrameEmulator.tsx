import React from "react";
import { Card } from "@/components/ui/card";
import { AppContext } from "@/Main";
import { use, useContext, useEffect, useRef, useState } from "react";

export const FrameEmulator = () => {
  const [PluginCom, setPluginCom] = useState<React.FC | null>(null);
  const appContext = useContext<IAppStateType>(AppContext);

  useEffect(() => {
    if (appContext.currentPlugin?.render) {
      const component = appContext.currentPlugin.render(null, {}, "dev");
      if (typeof component === "function") {
        setPluginCom(() => component);
      }
    }
  }, [appContext.currentPlugin]);

  return (
    <Card className="w-[792px] h-[612px] overflow-hidden border-1 mx-auto mt-4 rounded-none flex justify-center items-center">
      {PluginCom ? <PluginCom /> : <span>Plugin no disponible</span>}
    </Card>
  );
};
