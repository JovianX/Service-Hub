import TableDropdownFilter from 'app/shared-components/TableDropdownFilter';

const ServicesFilters = ({
  selectedNamespace,
  setSelectedNamespace,
  namespaces,
  selectedCluster,
  setSelectedCluster,
  clusters,
}) => {
  return (
    <div className='flex p-10'>
      <TableDropdownFilter
        dropdownItems={namespaces}
        label='Namespaces'
        handleSelectedValueChange={setSelectedNamespace}
        selectedValue={selectedNamespace}
      />
      <TableDropdownFilter
        dropdownItems={clusters}
        label='Clusters'
        handleSelectedValueChange={setSelectedCluster}
        selectedValue={selectedCluster}
      />
    </div>
  );
};

export default ServicesFilters;
