import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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

const Dashboard = () => {
  const dispatch = useDispatch();
  const dashboardData = useSelector(selectCounts);

  const { releases, repositories, charts, contexts, unhealthy, services } = dashboardData;

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
      <div>
        <div className='max-w-[1400px] m-auto'>
          <Typography
            component={motion.span}
            initial={{ x: -20 }}
            animate={{ x: 0, transition: { delay: 0.2 } }}
            delay={300}
            className='text-24 md:text-32 font-extrabold tracking-tight p-12 pl-24'
          >
            Helm
          </Typography>

          <motion.div
            className='grid pt-16 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-24 w-full min-w-0 p-24'
            variants={container}
            initial='hidden'
            animate='show'
          >
            <motion.div variants={item}>
              <SummaryWidget dataKey='Repositories' dataValue={repositories} textColor='text-orange-500' />
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
          </motion.div>
        </div>

        <div className='mt-36 max-w-[1400px] m-auto'>
          <Typography
            component={motion.span}
            initial={{ x: -20 }}
            animate={{ x: 0, transition: { delay: 0.2 } }}
            delay={300}
            className='text-24 md:text-32 font-extrabold tracking-tight p-12 pl-24'
          >
            Kubernetes
          </Typography>

          <motion.div
            className='grid pt-16 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-24 w-full min-w-0 p-24'
            variants={container}
            initial='hidden'
            animate='show'
          >
            <motion.div variants={item}>
              <SummaryWidget dataKey='Services' dataValue={services} />
            </motion.div>
            <motion.div variants={item}>
              <SummaryWidget dataKey='Contexts' dataValue={contexts} textColor='text-green-500' />
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <DashboardHeader />
      {renderContent()}
    </div>
  );
};

export default Dashboard;
