import { useState } from 'react';
import { EntityType, Property, SelectedField } from '../types/odataTypes';

interface PropertySelectorProps {
  entityType: EntityType;
  selectedFields: SelectedField[];
  onPropertySelect: (field: SelectedField) => void;
  currentPath: string[];
}

const PropertySelector = ({
  entityType,
  selectedFields,
  onPropertySelect,
  currentPath
}: PropertySelectorProps) => {
  const [selectedProperty, setSelectedProperty] = useState<string>('');

  const handlePropertySelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const propertyName = event.target.value;
    setSelectedProperty(propertyName);
    
    if (propertyName) {
      // Encontrar a propriedade selecionada
      const property = entityType.properties.find(p => p.name === propertyName);
      
      if (property) {
        const newField: SelectedField = {
          entityName: entityType.name,
          propertyName: property.name,
          displayName: `${entityType.name}.${property.name}`,
          path: [...currentPath]
        };
        
        onPropertySelect(newField);
      }
    }
  };

  // Verifica se uma propriedade já foi selecionada
  const isPropertySelected = (propertyName: string): boolean => {
    return selectedFields.some(
      field => field.entityName === entityType.name && field.propertyName === propertyName
    );
  };

  return (
    <div className="property-selector">
      <h3>Selecione uma propriedade de {entityType.name}</h3>
      <select
        value={selectedProperty}
        onChange={handlePropertySelect}
        className="property-select"
      >
        <option value="">-- Selecione uma propriedade --</option>
        {entityType.properties.map((property: Property) => (
          <option 
            key={property.name} 
            value={property.name}
            disabled={isPropertySelected(property.name)}
          >
            {property.name} ({property.type})
          </option>
        ))}
      </select>
    </div>
  );
};

export default PropertySelector; 