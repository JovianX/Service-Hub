import { styled } from '@mui/material/styles';

import FusePageSimple from '@fuse/core/FusePageSimple';

import DashboardHeader from './DashboardHeader';

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.palette.background.paper,
    boxShadow: `inset 0 0 0 1px  ${theme.palette.divider}`,
  },
}));

function Dashboard() {
  return (
    <Root
      header={<DashboardHeader />}
      content={<div className='w-full p-12 pt-16 sm:pt-24 lg:ltr:pr-0 lg:rtl:pl-0' />}
    />
  );
}

export default Dashboard;
