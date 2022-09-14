import { yupResolver } from '@hookform/resolvers/yup';
import { InputLabel, Select, TextField } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';

import FusePageCarded from '@fuse/core/FusePageCarded';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import _ from '@lodash';
import TableHeader from 'app/shared-components/TableHeader';

const SERVICE_TYPES = {
  KUBERNETES_INGRESS: 'kubernetes_ingress',
  KUBERNETES_SERVICE: 'kubernetes_service',
  HTTP_ENDPOINT: 'http_endpoint',
};

const formSchema = yup.object().shape({
  name: yup.string().required('You must enter a name'),
  description: yup.string().required('You must enter a description'),
  owner: yup.string().required('You must enter an owner'),
});

const defaultValues = {
  name: '',
  description: '',
  owner: '',
  type: SERVICE_TYPES.KUBERNETES_INGRESS,
};

const ServiceCreateForm = () => {
  const { reset, formState, watch, control, getValues } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(formSchema),
  });

  const { isValid, dirtyFields, errors } = formState;

  return (
    <div className='p-24'>
      <Controller
        name='name'
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            id='name'
            label='name'
            className='flex-auto mb-12'
            error={!!errors.name}
            helperText={errors?.name?.message}
            InputLabelProps={{
              shrink: true,
            }}
            variant='outlined'
            autoFocus
            required
            fullWidth
          />
        )}
      />

      <Controller
        name='description'
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            id='description'
            label='description'
            className='flex-auto mb-12'
            error={!!errors.description}
            helperText={errors?.description?.message}
            InputLabelProps={{
              shrink: true,
            }}
            variant='outlined'
            autoFocus
            required
            fullWidth
          />
        )}
      />

      <Controller
        name='owner'
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            id='owner'
            label='owner'
            className='flex-auto mb-12'
            error={!!errors.owner}
            helperText={errors?.owner?.message}
            InputLabelProps={{
              shrink: true,
            }}
            variant='outlined'
            autoFocus
            required
            fullWidth
          />
        )}
      />

      <Controller
        name='extendedProps.label'
        control={control}
        render={({ field }) => (
          <FormControl fullWidth {...field}>
            <InputLabel id='select-label'>Label</InputLabel>
            <Select
              labelId='select-label'
              id='label-select'
              // value={value}
              label='Label'
              // onChange={handleChange}
              // ref={ref}
              classes={{ select: 'flex items-center space-x-12' }}
            >
              {_.map(SERVICE_TYPES, (type) => (
                <MenuItem value={type} key={type} className='space-x-12'>
                  <span>{type}</span>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />
    </div>
  );
};

const ServiceCreate = () => {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <FusePageCarded
      header={<TableHeader title='Create New Service' />}
      content={<ServiceCreateForm />}
      scroll={isMobile ? 'normal' : 'content'}
      className='px-24'
    />
  );
};

export default ServiceCreate;
