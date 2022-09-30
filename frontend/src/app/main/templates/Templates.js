import { Button } from '@mui/material';
import { useState } from 'react';

import FusePageCarded from '@fuse/core/FusePageCarded';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import TableHeader from 'app/shared-components/TableHeader';

import TemplatesList from './TemplatesList';

const Templates = () => {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [openModal, setOpenModal] = useState(false);

  return (
    <FusePageCarded
      header={
        <>
          <TableHeader title='Templates' />
          <div className='px-24 py-32 flex items-center'>
            <Button
              size='large'
              color='primary'
              variant='contained'
              onClick={() => {
                setOpenModal(true);
              }}
            >
              Add templete
            </Button>
          </div>
        </>
      }
      content={<TemplatesList openModal={openModal} setOpenModal={setOpenModal} />}
      scroll={isMobile ? 'normal' : 'content'}
      className='px-24'
    />
  );
};

export default Templates;
