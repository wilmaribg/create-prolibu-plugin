import { Auth } from "../../utils/index.js";

export const prolibuLoginCmd = async (options) => {
  Auth.signIn();
};
