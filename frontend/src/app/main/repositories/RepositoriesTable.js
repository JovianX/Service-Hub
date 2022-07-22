import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
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
      <Paper className='h-full mx-12 rounded mt-12'>
        <FuseScrollbars className='grow overflow-x-auto'>
          <TableContainer>
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
                    <TableCell align='left'>{row.name}</TableCell>
                    <TableCell align='left'>{row.url}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </FuseScrollbars>
      </Paper>
    </div>
  );
};

export default RepositoriesTable;
