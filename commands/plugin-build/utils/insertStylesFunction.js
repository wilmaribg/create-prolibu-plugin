export default function insertStylesFunction(element, options) {
  const waitForElements = (attempts = 0) => {
    return new Promise((resolve) => {
      if (attempts > 100) return resolve([]);
      const selector = `[data-plugin-library="${process.env.libraryName}"]`;
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) return resolve(elements);
      setTimeout(() => {
        resolve(waitForElements(attempts + 1));
      }, 100);
    });
  };

  waitForElements().then((nodes) => {
    nodes.forEach((el) => {
      if (!el?.shadowRoot) return;

      const alreadyInserted = Array.from(el.shadowRoot.children).some(
        (child) =>
          child.tagName === "STYLE" && child.textContent === element.textContent
      );

      if (!alreadyInserted) {
        const cloned = element.cloneNode(true);
        el.shadowRoot.prepend(cloned);
      }
    });
  });
}
