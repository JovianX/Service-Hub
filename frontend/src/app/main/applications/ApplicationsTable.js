import AddIcon from '@mui/icons-material/Add';
import { Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import FuseLoading from '@fuse/core/FuseLoading';
import FuseScrollbars from '@fuse/core/FuseScrollbars/FuseScrollbars';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { getApplicationsList, selectApplications, selectIsApplicationsLoading } from 'app/store/applicationsSlice';
import { getContextList, selectContexts } from 'app/store/clustersSlice';
import { getTemplatesList } from 'app/store/templatesSlice';

import ApplicationDeleteDialogModal from './ApplicationDeleteDialogModal';
import ApplicationsModal from './ApplicationsModal';

const ApplicationsTable = () => {
  const dispatch = useDispatch();

  const [kubernetesConfiguration, setKubernetesConfiguration] = useState({});
  const [applications, setApplications] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openDeleteInfo, setOpenDeleteInfo] = useState({});

  const contextData = useSelector(selectContexts);
  const applicationsData = useSelector(selectApplications);
  const isLoading = useSelector(selectIsApplicationsLoading);

  useEffect(() => {
    dispatch(getApplicationsList());
    dispatch(getTemplatesList());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getContextList());
  }, [dispatch]);

  useEffect(() => {
    setApplications(applicationsData);
  }, [applicationsData]);

  useEffect(() => {
    setKubernetesConfiguration(contextData);
  }, [contextData]);

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
                  <TableCell>Template Name</TableCell>
                  <TableCell>Template Reversion</TableCell>
                  <TableCell>Creator email</TableCell>
                  <TableCell>Actions</TableCell>
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
                      <TableCell align='left'>{row.creator.email}</TableCell>
                      <TableCell align='right'>
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              ) : (
                ''
              )}
            </Table>
          </TableContainer>
          <ApplicationsModal
            openModal={openModal}
            setOpenModal={setOpenModal}
            kubernetesConfiguration={kubernetesConfiguration}
            setApplications={setApplications}
          />
        </FuseScrollbars>
      </Paper>
      {openDeleteModal && (
        <ApplicationDeleteDialogModal
          options={{
            id: openDeleteInfo.id,
            isOpenModal: true,
            title: `Delete applications ${openDeleteInfo.name}?`,
            text: 'Are you sure you want to proceed',
            confirmText: 'Delete',
          }}
          setApplications={setApplications}
          setOpenDeleteModal={setOpenDeleteModal}
        />
      )}
    </div>
  );
};

export default ApplicationsTable;
