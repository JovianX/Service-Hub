import i18next from 'i18next';

import { authRoles } from '../auth';

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
    auth: authRoles.staff,
  },
  // {
  //   id: 'services-component',
  //   title: 'services',
  //   translate: 'SERVICES',
  //   type: 'item',
  //   icon: 'developer_board',
  //   url: 'services',
  //   auth : authRoles.admin,
  // },
  {
    id: 'applications-component',
    title: 'Applications',
    translate: 'APPLICATIONS',
    type: 'item',
    icon: 'material-outline:apps',
    url: 'applications',
    auth: authRoles.staff,
  },
  {
    id: 'templates-component',
    title: 'Templates',
    translate: 'TEMPLATES',
    type: 'item',
    icon: 'heroicons-outline:template',
    url: 'templates',
    auth: authRoles.admin,
  },
  {
    id: 'helm-component',
    title: 'Helm',
    translate: 'HELM',
    type: 'group',
    icon: 'heroicons-outline:view-grid-add',
    auth: authRoles.staff,
    children: [
      {
        id: 'releases-component',
        title: 'Releases',
        translate: 'RELEASES',
        type: 'item',
        icon: 'heroicons-outline:cube-transparent',
        url: 'releases',
        auth: authRoles.staff,
      },
      {
        id: 'charts-component',
        title: 'Releases',
        translate: 'CHARTS',
        type: 'item',
        icon: 'heroicons-outline:cube',
        url: 'charts',
        auth: authRoles.staff,
      },
      {
        id: 'repositories-component',
        title: 'Repos',
        translate: 'REPOS',
        type: 'item',
        icon: 'heroicons-outline:archive',
        url: 'repositories',
        auth: authRoles.staff,
      },
    ],
  },
  {
    id: 'settings-component',
    title: 'Settings',
    translate: 'SETTINGS',
    type: 'group',
    icon: 'heroicons-outline:cog',
    auth: authRoles.admin,
    children: [
      {
        id: 'clusters-component',
        title: 'Clusters',
        translate: 'CLUSTERS',
        type: 'item',
        icon: 'heroicons-outline:collection',
        url: 'clusters',
      },
      {
        id: 'users-component',
        title: 'Users',
        translate: 'USERS',
        type: 'item',
        icon: 'heroicons-outline:users',
        url: 'users',
      },
    ],
  },
];

export default navigationConfig;
