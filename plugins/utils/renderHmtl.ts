export const renderHtml = (html: string, selector: string, content: string): string => {
  // Parseamos el HTML en un documento real del navegador
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Seleccionamos el elemento dentro del HTML original
  const target = doc.querySelector(selector);
  if (target) target.innerHTML = content;

  // Obtenemos el contenido final de <head> y <body>
  const head = doc.head.innerHTML;
  const body = doc.body.innerHTML;

  // Combinamos y devolvemos
  return head + body;
};
