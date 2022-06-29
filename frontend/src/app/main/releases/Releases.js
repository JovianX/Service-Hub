import FusePageCarded from '@fuse/core/FusePageCarded';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';

import ReleasesHeader from './ReleasesHeader';
import ReleasesTable from './ReleasesTable';

function Releases() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <FusePageCarded header={<ReleasesHeader />} content={<ReleasesTable />} scroll={isMobile ? 'normal' : 'content'} />
  );
}

export default Releases;
