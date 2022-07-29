export const checkTrimString = (string = '', limit = 50, chunkSize = 15) => {
  if (string?.length > limit) {
    return `${string.slice(0, chunkSize)}...${string.slice(-chunkSize)}`;
  }

  return string;
};
