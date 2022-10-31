import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';

const steps = ['Create Account', 'Add a Kubernetes cluster'];

const ModalStepper = () => {
  return (
    <Box>
      <Stepper activeStep={1} alternativeLabel className='my-24 w-3/4 mx-auto'>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default ModalStepper;
