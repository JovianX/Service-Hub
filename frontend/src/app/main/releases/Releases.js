import FusePageCarded from '@fuse/core/FusePageCarded';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import TableHeader from 'app/shared-components/TableHeader';

import ReleasesTable from './ReleasesTable';

function Releases() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <FusePageCarded
      header={<TableHeader title='Helm Releases' />}
      content={<ReleasesTable />}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default Releases;
