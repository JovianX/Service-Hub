import FileCopyIcon from '@mui/icons-material/FileCopy';
import {
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import { memo, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import FuseLoading from '@fuse/core/FuseLoading';
import FuseScrollbars from '@fuse/core/FuseScrollbars/FuseScrollbars';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { getAccessTokensList, selectAccessTokens, selectIsAccessTokensLoading } from 'app/store/accessTokensSlice';

import { getColorForStatus, getPresent } from '../../uitls';

import AccessTokenStatusModal from './AccessTokenStatusModal';
import DeleteAccessTokenModal from './DeleteAccessTokenModal';

const AccessTokensTable = memo(() => {
  const dispatch = useDispatch();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [statusModalInfo, setStatusModalInfo] = useState({
    open: false,
    status: '',
    token: '',
  });
  const [deleteModalInfo, setDeleteModalInfo] = useState({
    open: false,
    token: '',
  });

  const accessTokensData = useSelector(selectAccessTokens);
  const isLoading = useSelector(selectIsAccessTokensLoading);

  useEffect(() => {
    dispatch(getAccessTokensList());
  }, [dispatch]);

  const accessTokens = useMemo(() => {
    if (accessTokensData.length > 0) return accessTokensData;
    return [];
  }, [accessTokensData]);

  const handleClickCopyID = (id) => {
    setOpenSnackbar(true);
    navigator.clipboard.writeText(id);
  };

  const handleOpenStatusModal = (token, status) => {
    setStatusModalInfo({
      open: true,
      status,
      token,
    });
  };

  const handleDeleteAccessToken = (token) => {
    setDeleteModalInfo({
      open: true,
      token,
    });
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
      <Paper className='h-full mx-24 rounded'>
        <FuseScrollbars className='grow overflow-x-auto'>
          <TableContainer>
            <Table stickyHeader className='min-w-xl' aria-labelledby='tableTitle'>
              <TableHead>
                <TableRow>
                  <TableCell>Id</TableCell>
                  <TableCell align='center'>Status</TableCell>
                  <TableCell>Comment</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Expiration</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>

              {accessTokens.length ? (
                <TableBody>
                  {accessTokens.map((row) => (
                    <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell align='left'>{row.id.substring(0, 8).concat('...')}</TableCell>
                      <TableCell align='left'>
                        <Stack>
                          <Chip className='capitalize' label={row.status} color={getColorForStatus(row.status)} />
                        </Stack>
                      </TableCell>
                      <TableCell align='left'>{row.comment}</TableCell>
                      <TableCell align='left'>{getPresent(row.created_at)}</TableCell>
                      <TableCell align='left'>{getPresent(row.expiration_date)}</TableCell>
                      <TableCell align='right'>
                        <ButtonGroup aria-label='primary button group'>
                          <Button
                            className='ml-5'
                            onClick={() => handleOpenStatusModal(row.id, row.status)}
                            variant='text'
                            color={row.status === 'active' ? 'error' : 'success'}
                          >
                            {row.status === 'active' ? 'Deactivate' : 'Activate'}
                          </Button>
                          <IconButton className='text-gray-600' onClick={() => handleClickCopyID(row.id)}>
                            <FileCopyIcon />
                          </IconButton>

                          <Button variant='text' color='error' onClick={() => handleDeleteAccessToken(row.id)}>
                            <FuseSvgIcon className='hidden sm:flex'>heroicons-outline:trash</FuseSvgIcon>
                          </Button>
                        </ButtonGroup>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              ) : null}
            </Table>
          </TableContainer>
        </FuseScrollbars>
      </Paper>
      <Snackbar
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        message='Copied to clipboard'
      />
      {statusModalInfo.open && (
        <AccessTokenStatusModal statusModalInfo={statusModalInfo} setStatusModalInfo={setStatusModalInfo} />
      )}
      {deleteModalInfo.open && (
        <DeleteAccessTokenModal deleteModalInfo={deleteModalInfo} setDeleteModalInfo={setDeleteModalInfo} />
      )}
    </>
  );
});

export default AccessTokensTable;
