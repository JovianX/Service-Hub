import FusePageCarded from '@fuse/core/FusePageCarded';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import TableHeader from 'app/shared-components/TableHeader';

import RepositoriesTable from './RepositoriesTable';

const Repositories = () => {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <FusePageCarded
      header={<TableHeader title='Repositories' />}
      content={<RepositoriesTable />}
      scroll={isMobile ? 'normal' : 'content'}
      className='px-24'
    />
  );
};

export default Repositories;
