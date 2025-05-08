import fs from "fs";
import path from "path";
import ora from "ora";
import open from "open";
import http from "http";
import url from "url";
import { fileURLToPath } from "url"; // Importamos fileURLToPath para convertir la URL en una ruta de archivo

const __filename = fileURLToPath(import.meta.url); // Obtiene la ruta completa del archivo actual
const __dirname = path.dirname(__filename); // Obtiene el directorio donde se encuentra el archivo

export const Auth = () => {};

const storeName = ".prolibu-auth";
const authStorePath = path.resolve(__dirname, "..", storeName);

Auth.store = ({ apiKey, baseUrl }, spinner) => {
  const spin = spinner || ora("Storing apiKey...").start();
  if (apiKey && baseUrl) {
    fs.writeFileSync(
      authStorePath,
      JSON.stringify({ apiKey, baseUrl }, null, 2),
      "utf-8"
    );
    spin.succeed(`🔐 Token received. Connected to ${baseUrl}.`);
  } else {
    spin.warn("No token received, using default API key.");
  }
};

Auth.session = () => {
  if (fs.existsSync(authStorePath)) {
    const data = fs.readFileSync(authStorePath, "utf-8");
    return JSON.parse(data);
  }
  return null;
};

Auth.delete = () => {
  if (fs.existsSync(authStorePath)) {
    fs.unlinkSync(authStorePath);
    console.log("Token deleted successfully.");
  } else {
    console.log("No token found to delete.");
  }
};

Auth.signIn = () => {
  const devApiKey = process.env.TEST_API_KEY;
  const baseUrl = "https://dev10.prolibu.com";
  const signinUrl = "https://dev10.prolibu.com/v2/auth/signin";
  const spinner = ora("Logging in...");

  const server = http.createServer((req, res) => {
    const { query } = url.parse(req.url, true);
    if (req.url.startsWith("/auth/callback")) {
      const apiKey = query.apiKey || devApiKey;
      Auth.store({ apiKey, baseUrl }, spinner);
      res.end("Login completed. You may close this window.");
      server.close();
    }
  });

  server.listen(3456, () => {
    const loginUrl = `${signinUrl}?redirect=http://localhost:3456/auth/callback`;
    spinner.start();
    open(loginUrl);
  });
};
