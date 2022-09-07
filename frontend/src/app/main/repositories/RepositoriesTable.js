import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import FuseLoading from '@fuse/core/FuseLoading';
import FuseScrollbars from '@fuse/core/FuseScrollbars/FuseScrollbars';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import DialogModal from 'app/shared-components/DialogModal';
import {
  createRepository,
  deleteRepository,
  getRepositoryList,
  selectIsRepositoriesLoading,
  selectRepositories,
} from 'app/store/repositorySlice';

const RepositoriesTable = () => {
  const dispatch = useDispatch();
  const repositoryData = useSelector(selectRepositories);
  const isLoading = useSelector(selectIsRepositoriesLoading);

  useEffect(() => {
    dispatch(getRepositoryList());
  }, [dispatch]);

  const [open, setOpen] = useState(false);
  const [repositoryToDelete, setRepositoryToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmitCreate = async (e) => {
    e.preventDefault();
    setOpen(false);
    const repository = { name: e.target.name.value, url: e.target.url.value };
    await dispatch(createRepository(repository));
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
      <div className='min-h-[70px] m-12 flex justify-end items-center'>
        <Button className='mx-16' onClick={handleClickOpen} variant='contained' color='primary' startIcon={<AddIcon />}>
          Add repository
        </Button>
      </div>
      <div className='w-full flex flex-col min-h-full'>
        <Paper className='h-full mx-24 rounded mt-12'>
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
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
        <form onSubmit={handleSubmitCreate}>
          <DialogTitle className='bg-primary text-center text-white'>Add repository</DialogTitle>
          <DialogContent className='pb-0'>
            <div>
              <TextField
                name='name'
                type='text'
                required
                id='outlined-required'
                label='Name'
                margin='normal'
                fullWidth
              />
            </div>
            <div>
              <TextField name='url' type='text' required id='outlined-required' label='URL' margin='normal' fullWidth />
            </div>
          </DialogContent>
          <DialogActions className='p-24'>
            <Button className='mr-14' onClick={handleClose}>
              Cancel
            </Button>
            <Button type='submit' className='ml-12' variant='contained' color='primary' startIcon={<AddIcon />}>
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default RepositoriesTable;
