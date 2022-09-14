import TextField from '@mui/material/TextField';

import TableDropdownFilter from 'app/shared-components/TableDropdownFilter';

const ChartsFilters = ({ repositories, selectedRepository, setSelectedRepository, searchText, handleSearchText }) => (
  <div className='flex p-10'>
    <TableDropdownFilter
      dropdownItems={repositories}
      label='Repositories'
      handleSelectedValueChange={setSelectedRepository}
      selectedValue={selectedRepository}
    />

    <TextField
      label='Search in charts'
      placeholder='Enter a keyword'
      className='flex w-full sm:w-256 mx-8'
      value={searchText}
      inputProps={{
        'aria-label': 'Search',
      }}
      onChange={handleSearchText}
      variant='outlined'
      InputLabelProps={{
        shrink: true,
      }}
    />
  </div>
);

export default ChartsFilters;
