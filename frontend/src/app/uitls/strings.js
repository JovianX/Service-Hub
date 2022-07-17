export const checkTrimString = (string, limit, chunkSize) => {
  if (string.length && string.length > limit) {
    return `${string.slice(0, chunkSize)}...${string.slice(-chunkSize)}`;
  }

  return string;
};
