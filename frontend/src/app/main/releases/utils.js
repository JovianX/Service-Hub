export const getUniqueKeysFromReleasesData = (data, key) => {
  const values = data?.map((el) => el[key]);

  const uniqueItems = new Set(values);

  return Array.from(uniqueItems);
};

export const getSelectItemsFromArray = (arr) =>
  arr.map((el) => ({
    value: el,
    text: el,
  }));
