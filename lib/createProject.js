import fs from "fs";
import path from "path";

export async function createNewProject(language) {
  const cwd = process.cwd();
  const isTs = language === "TypeScript";

  const files = {
    ".prolibu": "// Prolibu project configuration\n",
    "src/index." + (isTs ? "tsx" : "jsx"): `import React from 'react';
import ReactDOM from 'react-dom/client';

const App = () => <h1>Hello from Prolibu!</h1>;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
`,
    "public/index.html": `<!DOCTYPE html>
<html>
  <head>
    <title>Prolibu App</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`,
    "package.json": JSON.stringify(
      {
        name: "prolibu-app",
        version: "1.0.0",
        scripts: {
          start: "webpack serve",
          build: "webpack",
        },
      },
      null,
      2
    ),
  };

  for (const [filePath, content] of Object.entries(files)) {
    const fullPath = path.join(cwd, filePath);
    const dir = path.dirname(fullPath);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(fullPath, content);
  }

  console.log("✅ Prolibu project created successfully!");
}
