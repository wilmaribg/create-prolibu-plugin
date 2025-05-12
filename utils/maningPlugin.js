import path from "path";
import { readFileSync } from "fs";
import * as changeCase from "change-case";

export const maningPlugin = () => {
  const pkg = JSON.parse(
    readFileSync(path.resolve(process.cwd(), "package.json"), "utf-8")
  );
  return changeCase.pascalCase(pkg.name);
};
