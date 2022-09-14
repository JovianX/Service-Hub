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
        dropdownItems={clusters}
        label='Clusters'
        handleSelectedValueChange={setSelectedCluster}
        selectedValue={selectedCluster}
      />

      <TableDropdownFilter
        dropdownItems={namespaces}
        label='Namespaces'
        handleSelectedValueChange={setSelectedNamespace}
        selectedValue={selectedNamespace}
        className='ml-12'
      />

    </div>
  );
};

export default ReleasesFilters;
