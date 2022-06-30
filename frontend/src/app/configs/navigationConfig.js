import i18next from 'i18next';

import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';

i18next.addResourceBundle('en', 'navigation', en);
i18next.addResourceBundle('tr', 'navigation', tr);
i18next.addResourceBundle('ar', 'navigation', ar);

const navigationConfig = [
  {
    id: 'dashboard-component',
    title: 'Dashboard',
    translate: 'DASHBOARD',
    type: 'item',
    icon: 'heroicons-outline:chart-pie',
    url: 'dashboard',
  },
  {
    id: 'releases-component',
    title: 'Releases',
    translate: 'RELESASES',
    type: 'item',
    icon: 'developer_board',
    url: 'releases',
  },
];

export default navigationConfig;
