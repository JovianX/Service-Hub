import TableDropdownFilter from 'app/shared-components/TableDropdownFilter';

const ReleasesFilters = ({
  selectedNamespace,
  setSelectedNamespace,
  namespaces,
  selectedCluster,
  setSelectedCluster,
  clusters,
  className,
}) => {
  return (
    <div className={`flex ${className}`}>
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
        className='ml-12'
      />
    </div>
  );
};

export default ReleasesFilters;
