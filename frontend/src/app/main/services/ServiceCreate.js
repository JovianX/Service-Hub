import FusePageCarded from '@fuse/core/FusePageCarded';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import TableHeader from 'app/shared-components/TableHeader';

const ServiceCreateForm = () => {
  return 'Form';
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
