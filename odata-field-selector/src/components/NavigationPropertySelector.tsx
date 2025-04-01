import { useState } from 'react';
import { EntityType, NavigationProperty, ODataMetadata } from '../types/odataTypes';

interface NavigationPropertySelectorProps {
  metadata: ODataMetadata;
  entityType: EntityType;
  onNavigate: (navProperty: NavigationProperty, targetEntityType: EntityType) => void;
  selectedPath: string[];
}

const NavigationPropertySelector = ({
  metadata,
  entityType,
  onNavigate,
  selectedPath
}: NavigationPropertySelectorProps) => {
  const [selectedNavProperty, setSelectedNavProperty] = useState<string>('');

  const handleNavPropertySelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const navPropertyName = event.target.value;
    setSelectedNavProperty(navPropertyName);
    
    if (navPropertyName) {
      // Encontrar a propriedade de navegação selecionada
      const navProperty = entityType.navigationProperties.find(
        np => np.name === navPropertyName
      );
      
      if (navProperty) {
        // Encontrar o tipo de entidade alvo
        const targetEntityTypeName = navProperty.targetEntity;
        const targetEntityType = Object.values(metadata.entityTypes).find(
          et => `${targetEntityTypeName}` === `${et.name}` || 
               `${targetEntityTypeName}` === `${metadata.entitySets[et.name]?.entityType}`
        );
        
        if (targetEntityType) {
          onNavigate(navProperty, targetEntityType);
        }
      }
    }
  };

  return (
    <div className="nav-property-selector">
      <h3>Navegação para outras entidades</h3>
      <select
        value={selectedNavProperty}
        onChange={handleNavPropertySelect}
        className="nav-property-select"
      >
        <option value="">-- Selecione uma navegação --</option>
        {entityType.navigationProperties.map((navProperty) => (
          <option key={navProperty.name} value={navProperty.name}>
            {navProperty.name} {navProperty.isCollection ? '(Coleção)' : ''}
          </option>
        ))}
      </select>
      
      {selectedPath.length > 0 && (
        <div className="current-path">
          <h4>Caminho atual:</h4>
          <p>{selectedPath.join(' > ')}</p>
        </div>
      )}
    </div>
  );
};

export default NavigationPropertySelector; 