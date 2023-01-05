import AddIcon from '@mui/icons-material/Add';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { createAccessToken, selectErrorMessage } from 'app/store/accessTokensSlice';

const CreateAccessTokenModal = ({ isCreateModalOpen, setIsCreateModalOpen }) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(isCreateModalOpen);
  const [loading, setLoading] = useState(false);
  const [infoMessageSuccess, setInfoMessageSuccess] = useState('');
  const [infoMessageError, setInfoMessageError] = useState('');
  const [expirationDate, setExpirationDate] = useState(new Date().toISOString());

  const errorMessage = useSelector(selectErrorMessage);

  useEffect(() => {
    if (errorMessage) setInfoMessageError(errorMessage);
  }, [errorMessage]);

  const handleChangeExpirationDate = (newDate) => {
    if (infoMessageError) setInfoMessageError('');
    setExpirationDate(newDate.toISOString());
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setIsCreateModalOpen(false);
    setLoading(false);
    setInfoMessageError('');
    setInfoMessageSuccess('');
  };

  const handleSubmitCreateAccessToken = async (e) => {
    e.preventDefault();
    if (infoMessageError) setInfoMessageError('');
    setLoading(true);
    const tokenData = {
      expiration_date: expirationDate,
      comment: e.target.comment.value,
    };
    await dispatch(createAccessToken(tokenData)).then(({ meta }) => {
      if (meta.rejectedWithValue) {
        setLoading(false);
      } else {
        setInfoMessageSuccess('The access token has been successfully installed');
        setLoading(false);
        setTimeout(() => {
          handleClose();
        }, 2000);
      }
    });
  };

  return (
    <div>
      <Dialog open={isModalOpen} onClose={handleClose} fullWidth maxWidth='sm'>
        <form onSubmit={handleSubmitCreateAccessToken}>
          <DialogTitle className='bg-primary text-center text-white'>Add access token</DialogTitle>
          <DialogContent className='pb-0'>
            <Box className='mt-24'>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div className='custom-date-picker'>
                  <DateTimePicker
                    label='Expiration Date'
                    renderInput={(params) => <TextField {...params} />}
                    value={expirationDate}
                    onChange={handleChangeExpirationDate}
                    minDate={dayjs(new Date())}
                  />
                </div>
              </LocalizationProvider>
            </Box>
            <TextField name='comment' type='text' required label='Comment' margin='normal' fullWidth />
          </DialogContent>
          <DialogActions className='p-24 justify-between'>
            <div>
              <>
                {infoMessageError && <p className='text-red'>{infoMessageError}</p>}
                {infoMessageSuccess && <p className='text-green'>{infoMessageSuccess}</p>}
              </>
            </div>
            <div />
            <div className='flex'>
              <Button className='mr-14' onClick={handleClose}>
                Cancel
              </Button>
              <LoadingButton
                type='submit'
                color='primary'
                loading={loading}
                loadingPosition='start'
                startIcon={<AddIcon />}
                variant='contained'
              >
                Add
              </LoadingButton>
            </div>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default CreateAccessTokenModal;
