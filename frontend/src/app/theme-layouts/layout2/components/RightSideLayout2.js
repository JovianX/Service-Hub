import { memo } from 'react';

import NotificationPanel from '../../shared-components/notificationPanel/NotificationPanel';
import QuickPanel from '../../shared-components/quickPanel/QuickPanel';

function RightSideLayout2() {
  return (
    <>
      <QuickPanel />

      <NotificationPanel />
    </>
  );
}

export default memo(RightSideLayout2);
