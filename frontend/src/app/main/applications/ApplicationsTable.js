import AddIcon from '@mui/icons-material/Add';
import { Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import FuseLoading from '@fuse/core/FuseLoading';
import FuseScrollbars from '@fuse/core/FuseScrollbars/FuseScrollbars';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { getApplicationsList, selectApplications, selectIsApplicationsLoading } from 'app/store/applicationsSlice';

import ApplicationDeleteDialogModal from './ApplicationDeleteDialogModal';
import ApplicationsModal from './ApplicationsModal';

const applications2 = [
  {
    application: {
      id: 1,
      created_at: '2022-10-06T14:19:59.869Z',
      name: 'It is application №1',
      description: 'string',
      manifest: 'string',
      status: 'created',
      context_name: 'string',
      namespace: 'string',
      user_inputs: {},
      template: {
        id: 0,
        created_at: '2022-10-06T14:19:59.869Z',
        name: 'namespace\'s name',
        description: 'string',
        revision: 0,
        enabled: true,
        default: true,
        template: 'string',
      },
      creator: {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        email: 'ee@ee.com',
        is_active: true,
        is_verified: true,
      },
      organization: {
        id: 0,
        title: 'string',
      },
    },
    results: {
      additionalProp1: {},
      additionalProp2: {},
      additionalProp3: {},
    },
  },
  {
    application: {
      id: 2,
      created_at: '2022-10-06T14:19:59.869Z',
      name: 'here is second app',
      description: 'string',
      manifest: 'string',
      status: 'created',
      context_name: 'string',
      namespace: 'string',
      user_inputs: {},
      template: {
        id: 0,
        created_at: '2022-10-06T14:19:59.869Z',
        name: 'string',
        description: 'string',
        revision: 1,
        enabled: true,
        default: true,
        template: 'string',
      },
      creator: {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        email: 'ee@ee.com',
        is_active: true,
        is_verified: true,
      },
      organization: {
        id: 0,
        title: 'string',
      },
    },
    results: {
      additionalProp1: {},
      additionalProp2: {},
      additionalProp3: {},
    },
  },
  {
    application: {
      id: 3,
      created_at: '2022-10-06T14:19:59.869Z',
      name: 'This is app 3',
      description: 'string',
      manifest: 'string',
      status: 'created',
      context_name: 'string',
      namespace: 'string',
      user_inputs: {},
      template: {
        id: 0,
        created_at: '2022-10-06T14:19:59.869Z',
        name: 'string',
        description: 'string',
        revision: 2,
        enabled: true,
        default: true,
        template: 'string',
      },
      creator: {
        id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        email: 'ee@ee.com',
        is_active: true,
        is_verified: true,
      },
      organization: {
        id: 0,
        title: 'string',
      },
    },
    results: {
      additionalProp1: {},
      additionalProp2: {},
      additionalProp3: {},
    },
  },
];

const ApplicationsTable = () => {
  const dispatch = useDispatch();

  const [applications, setApplications] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openDeleteInfo, setOpenDeleteInfo] = useState({});

  const applicationsData = useSelector(selectApplications);
  const isLoading = useSelector(selectIsApplicationsLoading);

  useEffect(() => {
    dispatch(getApplicationsList());
  }, [dispatch]);

  useEffect(() => {
    setApplications(applicationsData);
  }, [applicationsData]);

  const handleDeleteApplication = (id) => {
  return false
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
        <Button variant='contained' color='primary' startIcon={<AddIcon />} onClick={() => setOpenModal(true)}>
          Create Applications
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
                  <TableCell>Template Name</TableCell>
                  <TableCell>Template Reversion</TableCell>
                  <TableCell>Creator email</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {applications2?.map((row) => (
                  <TableRow key={row.application.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell align='left'>{row.application.name}</TableCell>
                    <TableCell align='left'>{row.application.status}</TableCell>
                    <TableCell align='left'>{row.application.template.name}</TableCell>
                    <TableCell align='left'>{row.application.template.revision}</TableCell>
                    <TableCell align='left'>{row.application.creator.email}</TableCell>
                    <TableCell align='right'>
                      <Button
                        onClick={() => {
                          setOpenDeleteModal(!openDeleteModal);
                          setOpenDeleteInfo({
                            id: row.application.id,
                            name: row.application.name,
                          });
                        }}
                        variant='text'
                        color='error'
                      >
                        <FuseSvgIcon className='hidden sm:flex'>heroicons-outline:trash</FuseSvgIcon>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <ApplicationsModal openModal={openModal} setOpenModal={setOpenModal} />
        </FuseScrollbars>
      </Paper>
      {openDeleteModal && (
        <ApplicationDeleteDialogModal
          options={{
            id: openDeleteInfo.id,
            isOpenModal: true,
            title: 'Delete applications',
            text: `Are you sure you want to proceed ${openDeleteInfo.name}?`,
            confirmText: 'Delete',
            action: handleDeleteApplication,
          }}
        />
      )}
    </div>
  );
};

export default ApplicationsTable;
