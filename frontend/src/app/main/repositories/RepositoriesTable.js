import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import FuseLoading from '@fuse/core/FuseLoading';
import FuseScrollbars from '@fuse/core/FuseScrollbars/FuseScrollbars';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import DialogModal from 'app/shared-components/DialogModal';
import {
  deleteRepository,
  getRepositoryList,
  selectIsRepositoriesLoading,
  selectRepositories,
} from 'app/store/repositorySlice';

import CreateRepositoryDialog from './CreateRepositoryDialog';

const RepositoriesTable = () => {
  const dispatch = useDispatch();
  const repositoryData = useSelector(selectRepositories);
  const isLoading = useSelector(selectIsRepositoriesLoading);

  useEffect(() => {
    dispatch(getRepositoryList());
  }, [dispatch]);

  const [repositoryToDelete, setRepositoryToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const toggleDeleteModalOpen = () => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
  };

  const handleDeleteRepository = (repository) => {
    setRepositoryToDelete(repository);
    toggleDeleteModalOpen();
  };

  const handleDeleteCancel = () => {
    toggleDeleteModalOpen();
    setRepositoryToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    await dispatch(deleteRepository(repositoryToDelete));
    toggleDeleteModalOpen();
    setRepositoryToDelete(null);
    await dispatch(getRepositoryList());
  };

  if (isLoading) {
    return (
      <div className='w-full flex flex-col min-h-full'>
        <FuseLoading />
      </div>
    );
  }

  return (
    <>
      <div className='m-12 flex justify-end items-center'>
        <Button
          onClick={() => setIsCreateModalOpen(!isCreateModalOpen)}
          variant='contained'
          color='primary'
          startIcon={<AddIcon />}
        >
          Create new repository
        </Button>
        {isCreateModalOpen && <CreateRepositoryDialog options={{ isCreateModalOpen: true }} />}
      </div>
      <div className='w-full flex flex-col min-h-full'>
        <Paper className='h-full mx-12 rounded mt-12'>
          <FuseScrollbars className='grow overflow-x-auto'>
            <TableContainer>
              <Table stickyHeader className='min-w-xl' aria-labelledby='tableTitle'>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>URL</TableCell>
                    <TableCell align='right'>Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {repositoryData?.map((row) => (
                    <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell align='left'>{row.name}</TableCell>
                      <TableCell align='left'>{row.url}</TableCell>
                      <TableCell align='right'>
                        <Button onClick={() => handleDeleteRepository(row.name)} variant='text' color='error'>
                          <FuseSvgIcon className='hidden sm:flex'>heroicons-outline:trash</FuseSvgIcon>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </FuseScrollbars>
        </Paper>
      </div>

      <DialogModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        title={`Delete repository ${repositoryToDelete}`}
        text='Are you sure you want to proceed?'
        onCancel={handleDeleteCancel}
        cancelText='Cancel'
        onConfirm={handleDeleteConfirm}
        confirmText='Delete'
        fullWidth
      />
    </>
  );
};

export default RepositoriesTable;
