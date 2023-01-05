import moment from 'moment';

export const getTimeFormat = (ts, format = 'YYYY-MM-DD HH:MM:SS') => {
  return moment(ts * 1000).format(format);
};

export const getTimeFormatWithoutSeconds = (ts, format = 'YYYY-MM-DD HH:MM') => {
  return moment(ts * 1000).format(format);
};

export const getPresent = (ts) => {
  if (!ts) return '';
  return new Date(+ts * 1000).toLocaleString().replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$2-$1');
};

export const getPresentFromIOSFormat = (timeInISO) => {
  return new Date(+new Date(timeInISO).getTime()).toLocaleString().replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$2-$1');
};
