import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import FusePageSimple from '@fuse/core/FusePageSimple';
import {
  getChartsCount,
  getContextsCount,
  getReleasesCount,
  getRepositoriesCount,
  getServicesCount,
  getUnhealthyCount,
  selectCounts,
} from 'app/store/dashboardSlice';

import DashboardHeader from './DashboardHeader';
import SummaryWidget from './SummaryWidget';

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.palette.background.paper,
    boxShadow: `inset 0 0 0 1px  ${theme.palette.divider}`,
  },
}));

const Dashboard = () => {
  const dispatch = useDispatch();
  const dashboardData = useSelector(selectCounts);

  const {
    releases,
    repositories,
    charts,
    contexts,
    unhealthy,
    services,
  } = dashboardData;

  useEffect(() => {
    dispatch(getReleasesCount());
    dispatch(getRepositoriesCount());
    dispatch(getChartsCount());
    dispatch(getContextsCount());
    dispatch(getUnhealthyCount());
    dispatch(getServicesCount());
  }, [dispatch]);

  const container = {
    show: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const renderContent = () => {
    return (
      <motion.div
        className='grid p-12 pt-16 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-24 w-full min-w-0 p-24'
        variants={container}
        initial='hidden'
        animate='show'
      >
        <motion.div variants={item} className='h-[108px]'>
          <SummaryWidget dataKey='Services' dataValue={services} />
        </motion.div>
        <motion.div variants={item}>
          <SummaryWidget dataKey='Unhealthy' dataValue={unhealthy} textColor='text-red-500' />
        </motion.div>
        <motion.div variants={item}>
          <SummaryWidget dataKey='Releases' dataValue={releases} textColor='text-amber-500' />
        </motion.div>
        <motion.div variants={item}>
          <SummaryWidget dataKey='Charts' dataValue={charts} textColor='text-teal-500' />
        </motion.div>
        <motion.div variants={item}>
          <SummaryWidget dataKey='Repos' dataValue={repositories} textColor='text-orange-500' />
        </motion.div>
        <motion.div variants={item}>
          <SummaryWidget dataKey='Contexts' dataValue={contexts} textColor='text-green-500' />
        </motion.div>
      </motion.div>
    );
  };

  return <Root header={<DashboardHeader />} content={renderContent()} />;
};

export default Dashboard;