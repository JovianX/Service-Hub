import FusePageCarded from '@fuse/core/FusePageCarded';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import TableHeader from 'app/shared-components/TableHeader';

import ClustersBlocks from './ClustersBlocks';

const Clusters = () => {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <FusePageCarded
      header={<TableHeader title='Kubernetes Clusters' />}
      content={<ClustersBlocks />}
      scroll={isMobile ? 'normal' : 'content'}
      className='px-24'
    />
  );
};

export default Clusters;
