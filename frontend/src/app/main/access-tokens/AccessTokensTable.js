import AddIcon from '@mui/icons-material/Add';
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
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import FuseLoading from '@fuse/core/FuseLoading';
import FuseScrollbars from '@fuse/core/FuseScrollbars/FuseScrollbars';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { getAccessTokensList, selectAccessTokens, selectIsAccessTokensLoading } from 'app/store/accessTokensSlice';

import { getColorForStatus, getPresent } from '../../uitls';

const AccessTokensTable = () => {
  const dispatch = useDispatch();

  const accessTokensData = useSelector(selectAccessTokens);
  const isLoading = useSelector(selectIsAccessTokensLoading);

  useEffect(() => {
    dispatch(getAccessTokensList());
  }, [dispatch]);

  const accessTokens = useMemo(() => {
    if (accessTokensData.length > 0) return accessTokensData;
    return [];
  }, [accessTokensData]);

  if (isLoading) {
    return (
      <div className='w-full flex flex-col min-h-full'>
        <FuseLoading />
      </div>
    );
  }

  return (
    <div className='w-full flex flex-col min-h-full'>
      <div className='m-24 flex justify-end items-center'>
        <Button variant='contained' color='primary' startIcon={<AddIcon />}>
          New Access Token
        </Button>
      </div>
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
                      <TableCell align='left'>{row.id}</TableCell>
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
                          <Button variant='text'>
                            <FileCopyIcon />
                          </Button>

                          <Button variant='text' color='error'>
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
    </div>
  );
};

export default AccessTokensTable;
