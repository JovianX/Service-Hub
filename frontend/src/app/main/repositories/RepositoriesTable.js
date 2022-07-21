import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import FuseLoading from '@fuse/core/FuseLoading';
import FuseScrollbars from '@fuse/core/FuseScrollbars/FuseScrollbars';
import { getRepositoryList, selectIsRepositoriesLoading, selectRepositories } from 'app/store/repositorySlice';

const RepositoriesTable = () => {
  const dispatch = useDispatch();
  const repositoryData = useSelector(selectRepositories);
  const isLoading = useSelector(selectIsRepositoriesLoading);

  console.log('repositoryData', repositoryData);

  useEffect(() => {
    dispatch(getRepositoryList());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className='w-full flex flex-col min-h-full'>
        <FuseLoading />
      </div>
    );
  }

  return (
    <div className='w-full flex flex-col min-h-full'>
      <FuseScrollbars className='grow overflow-x-auto'>
        <Table stickyHeader className='min-w-xl' aria-labelledby='tableTitle'>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>URL</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {repositoryData?.map((row) => (
              <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component='th' scope='row'>
                  {row.name}
                </TableCell>
                <TableCell align='left'>{row.url}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </FuseScrollbars>
    </div>
  );
};

export default RepositoriesTable;
