import {
  LoadingButton,
  Timeline,
  TimelineDot,
  TimelineContent,
  TimelineConnector,
  TimelineSeparator,
  TimelineItem,
} from '@mui/lab';
import { timelineItemClasses } from '@mui/lab/TimelineItem';
import { Divider, ListItemText, Typography, Chip, ListItemButton } from '@mui/material';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { makeTemplateDefault } from 'app/store/templatesSlice';

import { getTimeFormatWithoutSeconds } from '../../uitls';

const TemplatesListItem = ({ selectedIndex, mainIndex, template, setTemplateId, setSelectedTemplateId }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [selectedReversion, setSelectedReversion] = useState(0);

  const handleGetOneTemplate = (index, id) => {
    setSelectedTemplateId(id);
    setTemplateId(id);
    setSelectedReversion(index);
  };

  const handleClickMakeDefaultButton = async (id) => {
    await setLoading(true);
    await dispatch(makeTemplateDefault(id));
  };

  return (
    <>
      <ListItemButton
        className='hover:bg-white hover:cursor-default'
        style={{ borderLeft: selectedIndex === mainIndex ? '3px solid #2A3BAB' : '' }}
      >
        <ListItemText>
          <div className='flex justify-between'>
            <Typography component='p' variant='h6'>
              {template[0].name}
            </Typography>
          </div>
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
            {template?.map((item, index) => {
              return (
                <TimelineItem className='group' key={item.id}>
                  <TimelineSeparator>
                    <TimelineDot />
                    {template.length - 1 !== index && <TimelineConnector />}
                  </TimelineSeparator>
                  <div
                    className={`${
                      selectedIndex === mainIndex && selectedReversion === index && 'bg-blue/[.06]'
                    }  ease-in duration-300 hover:bg-gray-400/[.08] ml-12 w-full mb-7`}
                    onClick={() => {
                      handleGetOneTemplate(index, item.id);
                    }}
                  >
                    <TimelineContent>
                      <div className='min-h-[80px]'>
                        <div className='flex justify-between mb-10'>
                          <p>Reversion {item.revision}</p>
                          <Typography className='text-xs' component='p' variant='caption'>
                            {getTimeFormatWithoutSeconds(item.created_at)}
                          </Typography>
                        </div>
                        <div className='flex justify-between'>
                          <p className='w-9/12 text-gray-700'>{item.description}</p>
                          {item.default ? (
                            <Chip size='small' className='ml-12 py-3 h-full leading-loose' label='Default' />
                          ) : (
                            <LoadingButton
                              loading={loading}
                              className='hidden group-hover:flex px-8 h-full'
                              size='small'
                              color='primary'
                              onClick={() => handleClickMakeDefaultButton(item.id)}
                              variant='outlined'
                            >
                              Default
                            </LoadingButton>
                          )}
                        </div>
                      </div>
                    </TimelineContent>
                  </div>
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
