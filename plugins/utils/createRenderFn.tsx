// import path from "path";
// import webpack from "webpack";
// import { fileURLToPath } from "url";
// import WebpackDevServer from "webpack-dev-server";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const currentPath = path.resolve(process.cwd());
// console.log("roge currentPath ---->", currentPath);

import ReactDOM from "react-dom/client";

console.log("roge ReactDOM ---->", ReactDOM);

export const createRenderFn = (Component: any) => {
  return (node: HTMLElement, opts = {}, mode = "prod") => {
    // const ReactDOM = require(path.resolve(process.cwd()) "./react-dom");
    // console.log("roge createRenderFn opts ---->", opts);
    // if (mode === "dev") return Component;
    // const root = ReactDOM.createRoot(node);
    // root.render(<Component />);
  };
};
