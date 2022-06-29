import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';

import FuseScrollbars from '@fuse/core/FuseScrollbars';
import withRouter from '@fuse/core/withRouter';

function ReleasesTable() {
  return (
    <div className='w-full flex flex-col min-h-full'>
      <FuseScrollbars className='grow overflow-x-auto'>
        <Table stickyHeader className='min-w-xl' aria-labelledby='tableTitle'>
          <TableBody />
        </Table>
      </FuseScrollbars>
    </div>
  );
}

export default withRouter(ReleasesTable);
