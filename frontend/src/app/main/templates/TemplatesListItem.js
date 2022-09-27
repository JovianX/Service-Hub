import { ListItemButton } from '@mui/material';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import { getTimeFormat } from '../../uitls';

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
          <Typography component='p' variant='h6'>
            {template.name}
          </Typography>
          <div className='flex justify-between'>
            <Typography component='p' variant='subtitle2'>
              Reversion {template.revision}
            </Typography>
            <Typography component='p' variant='subtitle2'>
              {getTimeFormat(template.created_at)}
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
