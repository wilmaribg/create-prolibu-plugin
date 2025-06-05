import fs from "fs";
import path from "path";
import ora from "ora";
import open from "open";
import http from "http";
import url from "url";
import tmp from "tmp";
import { fileURLToPath } from "url"; // Importamos fileURLToPath para convertir la URL en una ruta de archivo

const __filename = fileURLToPath(import.meta.url); // Obtiene la ruta completa del archivo actual
const __dirname = path.dirname(__filename); // Obtiene el directorio donde se encuentra el archivo

export const Auth = () => {};

let authStorePath;
const storeName = ".prolibu-auth";
const authRoutePath = path.resolve(__dirname, "..", storeName);

Auth.store = ({ apiKey, baseUrl }, spinner) => {
  const spin = spinner || ora("Storing apiKey...").start();
  if (!fs.existsSync(authRoutePath)) {
    fs.writeFileSync(authRoutePath, "", "utf-8");
  }
  if (apiKey && baseUrl) {
    const tmpDir = tmp.fileSync();
    fs.writeFileSync(
      tmpDir.name,
      JSON.stringify({ apiKey, baseUrl }, null, 2),
      "utf-8"
    );
    fs.writeFileSync(
      authRoutePath,
      JSON.stringify({ tmp: tmpDir.name }, null, 2),
      "utf-8"
    );
    spin.succeed(`🔐 Token received. Connected to ${baseUrl}.`);
  } else {
    spin.warn("No token received, using default API key.");
  }
};

Auth.session = () => {
  if (!fs.existsSync(authRoutePath)) {
    throw new Error(
      `Auth route path does not exist: ${authRoutePath}. Please check the path or create the file.`
    );
  }
  const { tmp } = JSON.parse(fs.readFileSync(authRoutePath, "utf-8"));
  if (fs.existsSync(tmp)) {
    const data = fs.readFileSync(tmp, "utf-8");
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

Auth.readProlibuFileSync = () => {
  const prolibuConfigPath = path.resolve(process.cwd(), ".prolibu");
  if (!fs.existsSync(prolibuConfigPath)) {
    const errorMessage = `The file does not exist at the specified path: ${prolibuConfigPath}`;
    throw new Error(errorMessage);
  }
  return JSON.parse(fs.readFileSync(prolibuConfigPath, "utf-8"));
};

Auth.signIn = () => {
  const prolibuConfig = Auth.readProlibuFileSync();
  if (!prolibuConfig?.domain) {
    const errorMessage = `.prolibu file does not contain a domain. Please add a "domain" field to the .prolibu file.`;
    throw new Error(errorMessage);
  }

  const port = 3458;
  const baseUrl = prolibuConfig.domain;
  const signinPath = "/v2/auth/signin"; // El path que quieres agregar
  const signinUrl = new URL(signinPath, baseUrl);
  const spinner = ora("Logging in...");

  const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    // Habilitar CORS para todos los orígenes (puedes limitar esto si lo deseas)
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      // Responder a las solicitudes OPTIONS para CORS
      res.writeHead(204);
      res.end();
      return;
    }

    if (parsedUrl.pathname === "/auth" && req.method === "POST") {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk;
      });

      req.on("end", () => {
        try {
          const parsedBody = JSON.parse(body);
          const apiKey = parsedBody.apiKey;

          if (apiKey) {
            Auth.store({ apiKey, baseUrl }, spinner);
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end("Ok.");
            console.log("✅ Login successful.");
          } else {
            console.error("❌ apiKey not provided in the request body.");
          }
        } catch (err) {
          console.error("❌ Error parsing JSON body:", err.message);
        } finally {
          server.close();
        }
      });
    } else {
      console.error(
        "❌ Ruta o método HTTP inválido:",
        req.method,
        parsedUrl.pathname
      );
    }
  });

  server.listen(port, () => {
    const callbackUrl = `http://localhost:${port}/auth`;
    const loginUrl = new URL(signinUrl);
    const redirectUrl = new URL("/ui/spa/suite/", prolibuConfig.domain);
    redirectUrl.searchParams.set("callbackUrl", callbackUrl);
    loginUrl.searchParams.set("redirect", redirectUrl);
    spinner.start();
    open(loginUrl.toString());
  });
};
