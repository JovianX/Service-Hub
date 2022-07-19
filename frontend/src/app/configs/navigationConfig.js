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
    id: 'services-component',
    title: 'Services',
    translate: 'SERVICES',
    type: 'item',
    icon: 'developer_board',
    url: 'services',
  },
  {
    id: 'releases-component',
    title: 'Releases',
    translate: 'RELEASES',
    type: 'item',
    icon: 'developer_board',
    url: 'releases',
  },
  {
    id: 'charts-component',
    title: 'Releases',
    translate: 'CHARTS',
    type: 'item',
    icon: 'developer_board',
    url: 'charts',
  },
];

export default navigationConfig;
