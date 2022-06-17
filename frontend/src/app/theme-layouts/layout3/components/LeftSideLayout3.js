import FuseSidePanel from '@fuse/core/FuseSidePanel';
import { memo } from 'react';
import NavigationShortcuts from '../../shared-components/NavigationShortcuts';

function LeftSideLayout3() {
  return (
    <>
      <FuseSidePanel>
        <NavigationShortcuts className="py-16 px-8" variant="vertical" />
      </FuseSidePanel>
    </>
  );
}

export default memo(LeftSideLayout3);
