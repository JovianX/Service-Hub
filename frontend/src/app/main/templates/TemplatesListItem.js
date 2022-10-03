import LoadingButton from '@mui/lab/LoadingButton';
import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import { Chip, ListItemButton } from '@mui/material';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { makeTemplateDefault } from 'app/store/templatesSlice';

import { getTimeFormatWithoutSeconds } from '../../uitls';

const TemplatesListItem = ({ selectedIndex, index, template, setTemplateId }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleGetOneTemplate = (id) => {
    setTemplateId(id);
  };

  const handleClickMakeDefaultButton = async (id) => {
    await setLoading(true);
    await dispatch(makeTemplateDefault(id));
  };

  return (
    <>
      <ListItemButton
        selected={selectedIndex === index}
        onClick={() => handleGetOneTemplate(template.id)}
        style={{ borderLeft: selectedIndex === index ? '3px solid #2A3BAB' : '' }}
        className='group'
      >
        <ListItemText>
          <div className='flex justify-between'>
            <Typography className='w-3/5' component='p' variant='h6'>
              {template.name}
            </Typography>
            {template.default ? (
              <Chip className='ml-12' label='Default' />
            ) : (
              <LoadingButton
                loading={loading}
                className='hidden group-hover:flex py-3 px-8'
                size='small'
                color='primary'
                onClick={() => handleClickMakeDefaultButton(template.id)}
                variant='outlined'
              >
                Set Default
              </LoadingButton>
            )}
          </div>
          <div className='mt-10 flex justify-between h-[30px]'>
            <Typography component='p' variant='subtitle2'>
              {getTimeFormatWithoutSeconds(template.created_at)}
            </Typography>
          </div>
          <Typography component='p' variant='body2' className='text-gray-700'>
            {template.description}
          </Typography>

          <Timeline
            className='px-0'
            sx={{
              [`& .${timelineItemClasses.root}:before`]: {
                flex: 0,
                padding: 0,
                paddingRight: 0,
              },
            }}
          >
            {template.reversions &&
              template.reversions.map((item, index) => {
                return (
                  <TimelineItem key={item.id} sx={{ minHeight: '70px', paddingLeft: '16' }}>
                    <TimelineSeparator>
                      <TimelineDot />
                      {template.reversions.length - 1 !== index && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent sx={{ padding: '10px 0px 10px 16px' }}>
                      <div className='flex justify-between'>
                        <div>
                          <p>Reversion {item.revision}</p>
                          <p className='text-gray-700'>{item.description}</p>
                        </div>
                        <div className='text-xs'>{getTimeFormatWithoutSeconds(item.created_at)}</div>
                      </div>
                    </TimelineContent>
                  </TimelineItem>
                );
              })}
          </Timeline>
        </ListItemText>
      </ListItemButton>
      <Divider variant='fullWidth' component='li' />
    </>
  );
};

export default TemplatesListItem;
