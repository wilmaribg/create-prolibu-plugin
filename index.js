import path from "path";
import { Auth } from "./utils/index.js";
import { publisherService } from "./http-services/index.js";

// await publisherService.upload(path.resolve(process.cwd(), "test.txt"));

Auth.signIn();
