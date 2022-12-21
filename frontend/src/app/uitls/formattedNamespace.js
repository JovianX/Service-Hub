export const formattedNamespace = (namespace) => {
  return namespace.replaceAll(/[^@a-z0-9]/gi, '-').replaceAll(/[@]/g, '--');
};
