import TableDropdownFilter from 'app/shared-components/TableDropdownFilter';

const ChartsFilters = ({ repositories, selectedRepository, setSelectedRepository }) => {
  return (
    <div className='flex p-10'>
      <TableDropdownFilter
        dropdownItems={repositories}
        label='Repositories'
        handleSelectedValueChange={setSelectedRepository}
        selectedValue={selectedRepository}
      />
    </div>
  );
};

export default ChartsFilters;
