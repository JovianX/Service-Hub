import _ from '@lodash';
import FuseUtils from '@fuse/utils';

function NotificationModel(data) {
  data = data || {};

  return _.defaults(data, {
    id: FuseUtils.generateGUID(),
    icon: 'heroicons-solid:star',
    title: '',
    description: '',
    time: new Date().toISOString(),
    read: false,
    variant: 'default',
  });
}

export default NotificationModel;
