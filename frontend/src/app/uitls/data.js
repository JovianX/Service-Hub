import _ from '@lodash';

export const getUniqueKeysFromTableData = (data, key) => {
  const values = data?.map((el) => _.get(el, key)).filter(Boolean);

  const uniqueItems = new Set(values);

  return Array.from(uniqueItems);
};

export const getSelectItemsFromArray = (arr) =>
  arr.map((el) => ({
    value: el,
    text: el,
  }));
