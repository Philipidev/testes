import { useState } from 'react';
import { EntitySet, ODataMetadata } from '../types/odataTypes';

interface EntitySelectorProps {
  metadata: ODataMetadata;
  onEntitySelect: (entitySet: EntitySet) => void;
}

const EntitySelector = ({ metadata, onEntitySelect }: EntitySelectorProps) => {
  const [selectedEntitySetName, setSelectedEntitySetName] = useState<string>('');

  const handleEntitySelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const entitySetName = event.target.value;
    setSelectedEntitySetName(entitySetName);
    
    if (entitySetName) {
      const entitySet = metadata.entitySets[entitySetName];
      onEntitySelect(entitySet);
    }
  };

  return (
    <div className="entity-selector">
      <h3>Selecione uma entidade</h3>
      <select
        value={selectedEntitySetName}
        onChange={handleEntitySelect}
        className="entity-select"
      >
        <option value="">-- Selecione uma entidade --</option>
        {Object.values(metadata.entitySets).map((entitySet) => (
          <option key={entitySet.name} value={entitySet.name}>
            {entitySet.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default EntitySelector; 