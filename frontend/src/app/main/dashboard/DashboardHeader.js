import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

function DashboardHeader() {
  return (
    <div className='flex flex-col w-full px-24 sm:px-32'>
      <div className='flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 my-32 sm:my-48'>
        <div className='flex flex-auto items-center min-w-0'>
          <Avatar className='flex-0 w-64 h-64' alt='user photo' src=''>
            UserName
          </Avatar>
          <div className='flex flex-col min-w-0 mx-16'>
            <Typography className='text-2xl md:text-5xl font-semibold tracking-tight leading-7 md:leading-snug truncate'>
              Welcome back!
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHeader;
