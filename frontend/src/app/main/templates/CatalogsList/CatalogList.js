import { Divider } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';

const CatalogList = ({ transformedTemplates }) => {
  const [enabledTemplates, setEnabledTemplates] = useState([]);

  useEffect(() => {
    setEnabledTemplates(
      transformedTemplates
        .map(({ name, templates }) => ({
          name,
          templates: templates.filter((template) => template.enabled === true),
        }))
        .map(({ templates }) => {
          return templates[0];
        }),
    );
  }, [transformedTemplates]);

  return (
    <>
      {enabledTemplates?.map((card) => (
        <Card key={card.id} className='w-[250px] h-[250px] mr-20' sx={{ boxShadow: 3 }}>
          <CardContent className='p-12 pt-16 h-3/4'>
            <Typography gutterBottom variant='h6' component='div'>
              {card.name}
            </Typography>
            <Typography gutterBottom variant='body2'>
              Reversion {card.revision}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {card.description}
            </Typography>
          </CardContent>
          <Divider />
          <CardActions className='justify-end p-12'>
            <Button className='mt-[3.5px]' size='small' variant='contained' color='primary'>
              Deploy
            </Button>
          </CardActions>
        </Card>
      ))}
    </>
  );
};

export default CatalogList;
