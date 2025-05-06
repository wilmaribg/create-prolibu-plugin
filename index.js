import path from "path";
import { publisherService } from "./http-services/index.js";

await publisherService.upload(path.resolve(process.cwd(), "test.txt"));
