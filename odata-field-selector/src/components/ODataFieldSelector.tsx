import { useEffect, useState } from 'react';
import { EntitySet, EntityType, NavigationProperty, ODataMetadata, SelectedField } from '../types/odataTypes';
import { fetchODataMetadata } from '../services/odataService';
import EntitySelector from './EntitySelector';
import PropertySelector from './PropertySelector';
import NavigationPropertySelector from './NavigationPropertySelector';
import SelectedFieldsList from './SelectedFieldsList';
import ODataQueryDisplay from './ODataQueryDisplay';

const ODataFieldSelector = () => {
  const [metadata, setMetadata] = useState<ODataMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedEntitySet, setSelectedEntitySet] = useState<EntitySet | null>(null);
  const [currentEntityType, setCurrentEntityType] = useState<EntityType | null>(null);
  const [navigationPath, setNavigationPath] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<SelectedField[]>([]);
  const [entityPathHistory, setEntityPathHistory] = useState<EntityType[]>([]);
  const [odataQuery, setOdataQuery] = useState<string>('');
  const [showQuery, setShowQuery] = useState(false);

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        setLoading(true);
        const data = await fetchODataMetadata();
        setMetadata(data);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar metadados OData. Verifique a conexão e tente novamente.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadMetadata();
  }, []);

  const handleEntitySelect = (entitySet: EntitySet) => {
    setSelectedEntitySet(entitySet);
    
    // Encontrar o tipo de entidade correspondente
    if (metadata) {
      const entityTypeName = entitySet.entityType;
      const entityType = Object.values(metadata.entityTypes).find(
        et => `${entityTypeName}` === `${metadata.entitySets[et.name]?.entityType}` ||
             `${entityTypeName}` === `${et.name}`
      );
      
      if (entityType) {
        setCurrentEntityType(entityType);
        setNavigationPath([entityType.name]);
        setEntityPathHistory([entityType]);
      }
    }
  };

  const handlePropertySelect = (field: SelectedField) => {
    // Verificar se já existe este campo
    const fieldExists = selectedFields.some(
      f => f.entityName === field.entityName && f.propertyName === field.propertyName
    );
    
    if (!fieldExists) {
      setSelectedFields([...selectedFields, field]);
    }
  };

  const handleNavigate = (navProperty: NavigationProperty, targetEntityType: EntityType) => {
    // Atualizar o tipo de entidade atual
    setCurrentEntityType(targetEntityType);
    
    // Atualizar o caminho de navegação
    const newPath = [...navigationPath, navProperty.name];
    setNavigationPath(newPath);
    
    // Atualizar o histórico de entidades
    setEntityPathHistory([...entityPathHistory, targetEntityType]);
  };

  const handleRemoveField = (index: number) => {
    const newSelectedFields = [...selectedFields];
    newSelectedFields.splice(index, 1);
    setSelectedFields(newSelectedFields);
  };

  const handleGoBack = () => {
    if (entityPathHistory.length > 1) {
      // Remover o último item do histórico
      const newHistory = [...entityPathHistory];
      newHistory.pop();
      setEntityPathHistory(newHistory);
      
      // Atualizar a entidade atual para o item anterior
      setCurrentEntityType(newHistory[newHistory.length - 1]);
      
      // Atualizar o caminho de navegação
      const newPath = [...navigationPath];
      newPath.pop();
      setNavigationPath(newPath);
    }
  };

  const generateODataQuery = () => {
    if (!selectedEntitySet || selectedFields.length === 0) {
      setOdataQuery('Selecione uma entidade e pelo menos um campo para gerar a consulta.');
      setShowQuery(true);
      return;
    }

    // Agrupar campos selecionados por entidade e pelo caminho completo
    const fieldsByPath: Record<string, {entity: string, fields: string[]}> = {};
    
    selectedFields.forEach(field => {
      // Criar uma chave baseada no caminho de navegação
      const pathKey = field.path.join('/');
      
      if (!fieldsByPath[pathKey]) {
        fieldsByPath[pathKey] = {
          entity: field.entityName,
          fields: []
        };
      }
      
      fieldsByPath[pathKey].fields.push(field.propertyName);
    });

    // Construir a parte de seleção de campos para a entidade raiz
    const rootEntity = selectedEntitySet.name;
    const rootPath = Object.keys(fieldsByPath).find(path => 
      path.split('/').length === 1 && path.includes(rootEntity.split('.').pop() || rootEntity)
    ) || '';
    
    let select = '';
    if (rootPath && fieldsByPath[rootPath]) {
      select = fieldsByPath[rootPath].fields.join(',');
      delete fieldsByPath[rootPath];
    }

    // Construir a árvore de expansão
    // Esta função recursiva cria expansões aninhadas
    const buildExpansionTree = (paths: Record<string, {entity: string, fields: string[]}>) => {
      // Organizar os caminhos por nível de profundidade
      const pathsByDepth: Record<number, string[]> = {};
      
      Object.keys(paths).forEach(path => {
        const depth = path.split('/').length;
        if (!pathsByDepth[depth]) {
          pathsByDepth[depth] = [];
        }
        pathsByDepth[depth].push(path);
      });
      
      // Se não há caminhos, retorna um array vazio
      if (Object.keys(pathsByDepth).length === 0) {
        return [];
      }

      // Começar pelo nível mais superficial (normalmente 2, já que 1 é a raiz)
      const minDepth = Math.min(...Object.keys(pathsByDepth).map(Number));
      
      // Para cada caminho de profundidade mínima, criar uma expansão principal
      const expandItems: string[] = [];
      
      pathsByDepth[minDepth].forEach(path => {
        const pathParts = path.split('/');
        const navProp = pathParts[pathParts.length - 1]; // Última parte do caminho é a propriedade de navegação
        
        // Obter os campos para esta entidade
        const fields = paths[path].fields;
        let expandItem = `${navProp}($select=${fields.join(',')}`; 
        
        // Procurar expansões filhas (qualquer caminho que comece com este caminho)
        const childPaths: Record<string, {entity: string, fields: string[]}> = {};
        
        Object.keys(paths).forEach(childPath => {
          if (childPath !== path && childPath.startsWith(path + '/')) {
            // Cria um novo caminho relativo, removendo o início que já processamos
            const relativePath = childPath.substring(path.length + 1);
            childPaths[relativePath] = paths[childPath];
          }
        });
        
        // Se houver expansões filhas, adicionar recursivamente
        const childExpansions = buildExpansionTree(childPaths);
        if (childExpansions.length > 0) {
          expandItem += `;$expand=${childExpansions.join(',')}`;
        }
        
        expandItem += ')';
        expandItems.push(expandItem);
      });
      
      return expandItems;
    };

    // Gerar as expansões aninhadas usando a função recursiva
    const expand = buildExpansionTree(fieldsByPath);

    // Montar a consulta final
    let query = `${selectedEntitySet.name}?`;
    
    if (select) {
      query += `$select=${select}`;
    }
    
    if (expand.length > 0) {
      query += (select ? '&' : '') + `$expand=${expand.join(',')}`;
    }

    setOdataQuery(query);
    setShowQuery(true);
  };

  if (loading) {
    return <div className="loading">Carregando metadados OData...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!metadata) {
    return <div className="error">Não foi possível carregar os metadados.</div>;
  }

  return (
    <div className="odata-field-selector">
      <h2>Seletor de Campos OData</h2>
      
      {!selectedEntitySet && (
        <EntitySelector metadata={metadata} onEntitySelect={handleEntitySelect} />
      )}
      
      {selectedEntitySet && currentEntityType && (
        <div className="selection-container">
          <div className="navigation-info">
            <h3>Entidade atual: {currentEntityType.name}</h3>
            {entityPathHistory.length > 1 && (
              <button onClick={handleGoBack} className="back-btn">
                Voltar para {entityPathHistory[entityPathHistory.length - 2].name}
              </button>
            )}
          </div>
          
          <PropertySelector
            entityType={currentEntityType}
            selectedFields={selectedFields}
            onPropertySelect={handlePropertySelect}
            currentPath={navigationPath}
          />
          
          {currentEntityType.navigationProperties.length > 0 && (
            <NavigationPropertySelector
              metadata={metadata}
              entityType={currentEntityType}
              onNavigate={handleNavigate}
              selectedPath={navigationPath}
            />
          )}
          
          <SelectedFieldsList 
            selectedFields={selectedFields}
            onRemoveField={handleRemoveField}
          />
          
          {selectedFields.length > 0 && (
            <div className="generate-query-section">
              <button 
                onClick={generateODataQuery} 
                className="generate-query-btn"
              >
                Gerar Consulta OData
              </button>
            </div>
          )}
          
          {showQuery && (
            <ODataQueryDisplay queryString={odataQuery} />
          )}
        </div>
      )}
    </div>
  );
};

export default ODataFieldSelector; 