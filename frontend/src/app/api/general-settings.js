import axios from 'axios';

const GENERAL_SETTINGS_API_PATH = '/api/v1/organization/settings';

export const setSetting = async (settingName, requestBody) =>
  await axios.post(`${GENERAL_SETTINGS_API_PATH}/${settingName}`, requestBody);

export const getGeneralSettings = async () => await axios.get(`${GENERAL_SETTINGS_API_PATH}`);
