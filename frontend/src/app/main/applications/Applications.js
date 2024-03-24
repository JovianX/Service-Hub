import FusePageCarded from '@fuse/core/FusePageCarded';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import TableHeader from 'app/shared-components/TableHeader';

import ApplicationsTable from './ApplicationsTable';

const Application = () => {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <FusePageCarded
      header={<TableHeader title='Services' />}
      content={<ApplicationsTable />}
      scroll={isMobile ? 'normal' : 'content'}
      className='px-24'
    />
  );
};

export default Application;
