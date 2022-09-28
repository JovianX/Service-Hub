import { Chip, ListItemButton } from '@mui/material';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import { getTimeFormatWithoutSeconds } from '../../uitls';

const TemplatesListItem = ({ selectedIndex, index, template, setTemplateId }) => {
  const handleGetOneTemplate = (id) => {
    setTemplateId(id);
  };

  return (
    <>
      <ListItemButton
        selected={selectedIndex === index}
        onClick={() => handleGetOneTemplate(template.id)}
        style={{ borderLeft: selectedIndex === index ? '3px solid #2A3BAB' : '' }}
      >
        <ListItemText>
          <div className='flex justify-between'>
            <Typography className='w-[70%]' component='p' variant='h6'>
              {template.name}
            </Typography>
            {template.default && <Chip className='ml-12' label='Default' />}
          </div>
          <div className='mt-6 flex justify-between'>
            <Typography component='p' variant='subtitle2'>
              Reversion {template.revision}
            </Typography>
            <Typography component='p' variant='subtitle2'>
              {getTimeFormatWithoutSeconds(template.created_at)}
            </Typography>
          </div>
          <Typography component='p' variant='body2' style={{ color: '#616161' }}>
            {template.description}
          </Typography>
        </ListItemText>
      </ListItemButton>
      <Divider variant='fullWidth' component='li' />
    </>
  );
};

export default TemplatesListItem;
