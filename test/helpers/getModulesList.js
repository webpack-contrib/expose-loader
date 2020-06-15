export default (name, stats) => {
  const { modules } = stats.toJson({ source: true });

  const moduleNames = modules
    .map((item) => item.id)
    .filter((item) => item.startsWith(name));

  return moduleNames;
};
