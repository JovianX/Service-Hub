import AddIcon from '@mui/icons-material/Add';
import AutoDeleteOutlinedIcon from '@mui/icons-material/AutoDeleteOutlined';
import {
  Button,
  FormGroup,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import ButtonGroup from '@mui/material/ButtonGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import FuseLoading from '@fuse/core/FuseLoading';
import FuseScrollbars from '@fuse/core/FuseScrollbars/FuseScrollbars';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import {
  getApplicationsList,
  selectApplications,
  selectIsApplicationsLoading,
  setIsFirstApplicationsRequest,
} from 'app/store/applicationsSlice';
import { getContextList, selectContexts } from 'app/store/clustersSlice';
import { getTemplatesList } from 'app/store/templatesSlice';

import { useGetMe } from '../../hooks/useGetMe';
import { getPresent } from '../../uitls';

import ApplicationsModal from './ApplicationsModal';
import ApplicationTtl from './ApplicationTtl';
import DeleteApplicationModal from './DeleteApplicationModal';

const ApplicationsTable = () => {
  const dispatch = useDispatch();

  const [kubernetesConfiguration, setKubernetesConfiguration] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openDeleteInfo, setOpenDeleteInfo] = useState({});
  const [openTtlModal, setOpenTtlModal] = useState(false);
  const [parameters, setParameters] = useState({});
  const [showOnlyMine, setShowOnlyMine] = useState(false);

  const contextData = useSelector(selectContexts);
  const applicationsData = useSelector(selectApplications);
  const isLoading = useSelector(selectIsApplicationsLoading);
  const user = useGetMe();

  useEffect(() => {
    const getApplicationsTimer = setInterval(() => {
      dispatch(getApplicationsList());
    }, 6000);

    return () => clearInterval(getApplicationsTimer);
  }, []);

  useEffect(() => {
    dispatch(getApplicationsList());
    dispatch(setIsFirstApplicationsRequest());
    dispatch(getTemplatesList());
    dispatch(getContextList());
  }, [dispatch]);

  useEffect(() => {
    setKubernetesConfiguration(contextData);
  }, [contextData]);

  const applications = useMemo(() => {
    const sortedByCreatedAt = [...applicationsData].sort((first, second) => first.created_at - second.created_at);
    if (showOnlyMine) {
      return sortedByCreatedAt.filter((item) => item.creator.email === user.email);
    }
    return sortedByCreatedAt;
  }, [applicationsData, showOnlyMine]);

  const handleShowOnlyMineApplications = () => {
    setShowOnlyMine(!showOnlyMine);
  };

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
        <FormGroup>
          <FormControlLabel
            control={<Switch checked={showOnlyMine} onChange={handleShowOnlyMineApplications} />}
            label='Only mine'
          />
        </FormGroup>
        <Button variant='contained' color='primary' startIcon={<AddIcon />} onClick={() => setOpenModal(true)}>
          Deploy Application
        </Button>
      </div>
      <Paper className='h-full mx-24 rounded'>
        <FuseScrollbars className='grow overflow-x-auto'>
          <TableContainer>
            <Table stickyHeader className='min-w-xl' aria-labelledby='tableTitle'>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Template</TableCell>
                  <TableCell>Reversion</TableCell>
                  <TableCell>TTL</TableCell>
                  <TableCell>Created By</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>

              {applications.length ? (
                <TableBody>
                  {applications.map((row) => (
                    <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell align='left'>{row.name}</TableCell>
                      <TableCell align='left'>{row.status}</TableCell>
                      <TableCell align='left'>{row.template.name}</TableCell>
                      <TableCell align='left'>{row.template.revision}</TableCell>
                      <TableCell align='left'>{getPresent(row.ttl)}</TableCell>
                      <TableCell align='left'>{row.creator.email}</TableCell>
                      <TableCell align='left'>{getPresent(row.created_at)}</TableCell>
                      <TableCell align='right'>
                        <ButtonGroup aria-label='primary button group'>
                          <Button
                            variant='text'
                            color='error'
                            onClick={() => {
                              setParameters({
                                currentDate: row.ttl,
                                id: row.id,
                              });
                              setOpenTtlModal(true);
                            }}
                          >
                            <AutoDeleteOutlinedIcon />
                          </Button>
                          <Button
                            onClick={() => {
                              setOpenDeleteModal(!openDeleteModal);
                              setOpenDeleteInfo({
                                id: row.id,
                                name: row.name,
                              });
                            }}
                            variant='text'
                            color='error'
                          >
                            <FuseSvgIcon className='hidden sm:flex'>heroicons-outline:trash</FuseSvgIcon>
                          </Button>
                        </ButtonGroup>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              ) : (
                ''
              )}
            </Table>
          </TableContainer>
          <ApplicationTtl parameters={parameters} openTtlModal={openTtlModal} setOpenTtlModal={setOpenTtlModal} />
          <ApplicationsModal
            openModal={openModal}
            setOpenModal={setOpenModal}
            kubernetesConfiguration={kubernetesConfiguration}
          />
        </FuseScrollbars>
      </Paper>
      {openDeleteModal && (
        <DeleteApplicationModal
          options={{
            id: openDeleteInfo.id,
            isOpenModal: true,
            title: `Delete applications ${openDeleteInfo.name}?`,
            text: 'Are you sure you want to proceed',
            confirmText: 'Delete',
          }}
          setOpenDeleteModal={setOpenDeleteModal}
        />
      )}
    </div>
  );
};

export default ApplicationsTable;
