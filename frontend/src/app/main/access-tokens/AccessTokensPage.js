import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';

import AccessTokensTable from './AccessTokensTable';

const AccessTokensPage = () => {
  return (
    <div className='w-full flex flex-col min-h-full'>
      <div className='m-24 flex justify-end items-center'>
        <Button variant='contained' color='primary' startIcon={<AddIcon />}>
          New Access Token
        </Button>
      </div>

      <AccessTokensTable />
    </div>
  );
};
export default AccessTokensPage;
