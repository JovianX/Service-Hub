import FusePageCarded from '@fuse/core/FusePageCarded';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import TableHeader from 'app/shared-components/TableHeader';

import InvitesTable from './InvitesTable';

const Invites = () => {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <FusePageCarded
      header={<TableHeader title='Users Invites' />}
      content={<InvitesTable />}
      // content={'Invites'}
      scroll={isMobile ? 'normal' : 'content'}
      className='px-24'
    />
  );
};

export default Invites;
