import TableDropdownFilter from 'app/shared-components/TableDropdownFilter';

const ReleasesFilters = ({
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

export default ReleasesFilters;
