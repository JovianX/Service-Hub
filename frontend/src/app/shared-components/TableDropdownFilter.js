import { InputLabel, Select } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';

const TableDropdownFilter = ({ dropdownItems, selectedValue, handleSelectedValueChange, label }) => {
  const renderMenuItems = (items) => {
    return items.map((namespace) => (
      <MenuItem value={namespace.value} key={namespace.value}>
        {namespace.text}
      </MenuItem>
    ));
  };

  return (
    <FormControl className='flex w-full sm:w-200' variant='outlined'>
      <InputLabel id='category-select-label'>{label}</InputLabel>
      <Select
        labelId='cluster-select-label'
        id='cluster-select'
        label='Clusters'
        value={selectedValue}
        onChange={handleSelectedValueChange}
      >
        <MenuItem value='all'>
          <em> All </em>
        </MenuItem>
        {renderMenuItems(dropdownItems)}
      </Select>
    </FormControl>
  );
};

export default TableDropdownFilter;
