import { Divider } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { selectContexts } from 'app/store/clustersSlice';

import ApplicationsModal from '../../applications/ApplicationsModal';

const CatalogList = ({ transformedTemplates }) => {
  const [enabledTemplates, setEnabledTemplates] = useState([]);
  const [template, setTemplate] = useState({});
  const [kubernetesConfiguration, setKubernetesConfiguration] = useState({});
  const [openModal, setOpenModal] = useState(false);

  const contextData = useSelector(selectContexts);

  useEffect(() => {
    setKubernetesConfiguration(contextData);
  }, [contextData]);

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
      {enabledTemplates?.map((template) => (
        <Card key={template.id} className='w-[250px] h-[250px] mr-20' sx={{ boxShadow: 3 }}>
          <CardContent className='p-12 pt-16 h-3/4'>
            <Typography gutterBottom variant='h6' component='div'>
              {template.name}
            </Typography>
            <Typography gutterBottom variant='body2'>
              Reversion {template.revision}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {template.description}
            </Typography>
          </CardContent>
          <Divider />
          <CardActions className='justify-end p-12'>
            <Button
              className='mt-[3.5px]'
              size='small'
              variant='contained'
              color='primary'
              onClick={() => {
                setOpenModal(true);
                setTemplate(template);
              }}
            >
              Deploy
            </Button>
          </CardActions>
        </Card>
      ))}
      <ApplicationsModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        kubernetesConfiguration={kubernetesConfiguration}
        templateFromCatalog={template}
      />
    </>
  );
};

export default CatalogList;
