import FusePageCarded from '@fuse/core/FusePageCarded';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import TableHeader from 'app/shared-components/TableHeader';

import ChartsTable from './ChartsTable';

const Charts = () => {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <FusePageCarded
      header={<TableHeader title='Helm Charts' />}
      content={<ChartsTable />}
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
};

export default Charts;
