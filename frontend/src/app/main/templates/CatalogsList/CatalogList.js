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
        <Card key={card.id} className='w-[345px] mr-12'>
          <CardContent className='p-12'>
            <Typography gutterBottom variant='h5' component='div'>
              {card.name}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Last reversion number: {card.revision}
            </Typography>
          </CardContent>
          <Divider />
          <CardActions className='justify-end p-12'>
            <Button size='small' variant='contained' color='primary' onClick={() => {}}>
              Deploy
            </Button>
          </CardActions>
        </Card>
      ))}
    </>
  );
};

export default CatalogList;
