import { createApi } from '@reduxjs/toolkit/query/react';

import { getGeneralSettings as getGeneralSettingsAPI, setSetting as setSettingAPI } from '../api';

export const generalSettingsAPI = createApi({
  reducerPath: 'generalSettingsAPI',
  endpoints: (builder) => ({
    getGeneralSettings: builder.query({
      async queryFn() {
        const res = await getGeneralSettingsAPI();
        let { data } = res;
        data = Object.entries(data.changed);
        return { data };
      },
    }),
    postSettingByName: builder.mutation({
      async queryFn({ settingName, requestBody }) {
        await setSettingAPI(settingName, requestBody);
      },
    }),
  }),
});

export const { useGetGeneralSettingsQuery, usePostSettingByNameMutation } = generalSettingsAPI;
