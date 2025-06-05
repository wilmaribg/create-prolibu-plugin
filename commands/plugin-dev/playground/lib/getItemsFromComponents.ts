export const getItemsFromComponents = (components: any[]) => {
  return components.map((component) => {
    return {
      title: component.label,
      description: component.description,
      url: `#${component.name}`,
      render: component.render,
      isActive: false,
    };
  });
};
