import FusePageCarded from '@fuse/core/FusePageCarded';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import TableHeader from 'app/shared-components/TableHeader';

import InvitationsTable from './InvitationsTable';
import UsersTable from './UsersTable';

const Users = () => {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <FusePageCarded
      header={<TableHeader title='Users' />}
      content={
        <>
          <InvitationsTable />
          <UsersTable />
        </>
      }
      scroll={isMobile ? 'normal' : 'content'}
      className='px-24'
    />
  );
};

export default Users;
