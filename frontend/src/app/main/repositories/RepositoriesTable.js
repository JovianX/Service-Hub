import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
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
import { useState, useEffect, useRef } from 'react';
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
  selectErrorsInfo,
} from 'app/store/repositorySlice';

const RepositoriesTable = () => {
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const repositoryData = useSelector(selectRepositories);
  const isLoading = useSelector(selectIsRepositoriesLoading);
  const errorsInfo = useSelector(selectErrorsInfo);

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [repositoryToDelete, setRepositoryToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(true);

  const handleClickSaveButton = (e) => {
    e.preventDefault();
    setLoading(true);
    if (!e.target.form?.name.value || !e.target.form?.url.value) {
      setLoading(false);
    }
    inputRef.current.click();
  };

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
    if (errorsInfo) {
      setShowErrorMessage(false);
    }
    setOpen(false);
  };

  const handleSubmitCreate = async (e) => {
    e.preventDefault();
    const repository = { name: e.target.name.value, url: e.target.url.value };
    const data = await dispatch(createRepository(repository));
    if (data.payload?.status === 'ERROR') {
      setShowErrorMessage(true);
      setTimeout(() => {
        setLoading(false);
      }, 500);
      return false;
    }
    setLoading(false);
    setOpen(false);
    dispatch(getRepositoryList());
  };

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
      <div className='min-h-[70px] m-12 flex justify-end items-center'>
        <Button className='mx-16' onClick={handleClickOpen} variant='contained' color='primary' startIcon={<AddIcon />}>
          Add repository
        </Button>
      </div>
      <div className='w-full flex flex-col min-h-full'>
        <Paper className='h-full mx-24 rounded mt-12'>
          <FuseScrollbars className='grow overflow-x-auto'>
            {repositoryData.length ? (
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
            ) : (
              <div className='text-center p-[20px]'>
                <h2 className='mb-[12px] text-2xl'>No repositories yet</h2>
                <p className='mb-[16px] text-xl'>
                  The list of repositories is empty. To add a repositories, fill out the form above
                </p>
              </div>
            )}
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
          <DialogTitle className='bg-primary text-center text-white'>Create new repository</DialogTitle>
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
          <DialogActions className='p-24 justify-between'>
            <div>{showErrorMessage && errorsInfo?.message && <p className='text-red'>{errorsInfo.message}</p>}</div>
            <div className='flex'>
              <Button className='mr-14' onClick={handleClose}>
                Cancel
              </Button>
              <LoadingButton
                color='primary'
                onClick={handleClickSaveButton}
                loading={loading}
                loadingPosition='start'
                startIcon={<SaveIcon />}
                variant='contained'
              >
                Save
              </LoadingButton>
            </div>
            <input ref={inputRef} type='submit' className='hidden' />
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default RepositoriesTable;
