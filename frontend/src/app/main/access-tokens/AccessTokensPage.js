import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import { useState } from 'react';

import AccessTokensTable from './AccessTokensTable';
import CreateAccessTokenModal from './CreateAccessTokenModal';

const AccessTokensPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className='w-full flex flex-col min-h-full'>
      <div className='m-24 flex justify-end items-center'>
        <Button variant='contained' color='primary' startIcon={<AddIcon />} onClick={() => setIsCreateModalOpen(true)}>
          New Access Token
        </Button>
      </div>

      <AccessTokensTable />
      {isCreateModalOpen && (
        <CreateAccessTokenModal isCreateModalOpen={isCreateModalOpen} setIsCreateModalOpen={setIsCreateModalOpen} />
      )}
    </div>
  );
};
export default AccessTokensPage;
