import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

function createData(name, calories, fat, carbs) {
  return { name, calories, fat, carbs };
}

const rows = [
  createData('Nginx', 'true', 'true', 1),
  createData('Nginx1', 'true', 'true', 1),
  createData('Nginx2', 'true', 'true', 1),
];

const Deployments = () => {
  return (
    <TableContainer>
      <Typography variant='h6' id='tableTitle'>
        Deployments
      </Typography>
      <Table size='small'>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align='right'>Ready</TableCell>
            <TableCell align='right'>Available</TableCell>
            <TableCell align='right'>Up-To-Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell component='th' scope='row'>
                {row.name}
              </TableCell>
              <TableCell align='right'>{row.calories}</TableCell>
              <TableCell align='right'>{row.fat}</TableCell>
              <TableCell align='right'>{row.carbs}</TableCell>
              <TableCell align='right'>{row.protein}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Deployments;
