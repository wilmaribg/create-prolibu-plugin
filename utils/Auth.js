import fs from "fs";
import path from "path";
import ora from "ora";
import open from "open";
import http from "http";
import url from "url";

export const Auth = () => {};

const storeName = ".prolibu-auth";
const authStorePath = path.resolve(process.cwd(), storeName);

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
  const baseUrl = "https://dev11.prolibu.com";
  const signinUrl = "https://dev11.prolibu.com/v2/auth/signin";
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
