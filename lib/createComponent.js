import fs from "fs";
import path from "path";

export async function createComponent({ componentName, isStateful }) {
  const componentDir = path.join(process.cwd(), "src", "components");
  fs.mkdirSync(componentDir, { recursive: true });

  const filePath = path.join(componentDir, `${componentName}.jsx`);

  const content = isStateful
    ? `import React, { useState } from 'react';

export default function ${componentName}() {
  const [state, setState] = useState(null);
  return <div>${componentName} component</div>;
}
`
    : `import React from 'react';

export default function ${componentName}() {
  return <div>${componentName} component</div>;
}
`;

  fs.writeFileSync(filePath, content);
  console.log(`✅ Component "${componentName}" created!`);
}
