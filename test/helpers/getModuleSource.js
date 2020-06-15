export default (name, stats) => {
  const { modules } = stats.toJson({ source: true });
  const module = modules.find((m) => m.name.endsWith(name));

  return module.source;
};
