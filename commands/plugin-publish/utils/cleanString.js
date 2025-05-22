/**
 * Limpia la descripción del package.json eliminando las comillas y espacios innecesarios.
 * @param {string} str La descripción a procesar.
 * @returns {string} La descripción limpia.
 */
export const cleanString = (str) => {
  return str.trim().replace(/"/gm, "");
};
