import axios from 'axios';
import { EntitySet, EntityType, NavigationProperty, ODataMetadata, Property } from '../types/odataTypes';
import { mockMetadata } from './mockMetadata';

// URL da API através do proxy do Vite para evitar problemas de CORS
const ODATA_METADATA_URL = '/odata-api/oDataInspecao/$metadata';
const USE_EXAMPLE_DATA = false; // Altere para false para usar a API real

export const fetchODataMetadata = async (): Promise<ODataMetadata> => {
  try {
    if (USE_EXAMPLE_DATA) {
      // Usar dados mockados diretamente
      console.log("Usando dados mockados");
      return mockMetadata;
    } else {
      // Fazer requisição à API real - para metadados, o formato geralmente é XML
      const response = await axios.get(ODATA_METADATA_URL, {
        responseType: 'text' // Garantir que recebemos o XML como texto
      });
      
      console.log("Resposta da API recebida");
      
      // Verificar se a resposta tem dados válidos
      if (response.data) {
        return parseXmlMetadata(response.data);
      } else {
        throw new Error('Resposta da API não contém dados válidos');
      }
    }
  } catch (error) {
    console.error('Erro ao carregar metadados:', error);
    throw new Error('Falha ao carregar metadados OData');
  }
};

// Função para processar metadados no formato XML usando DOMParser (browser-compatible)
const parseXmlMetadata = (xmlData: string): ODataMetadata => {
  try {
    // Usar DOMParser nativo do browser para analisar o XML
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, "application/xml");
    
    console.log("XML analisado com DOMParser");
    
    const entityTypes: Record<string, EntityType> = {};
    const entitySets: Record<string, EntitySet> = {};
    
    // Processar EntityTypes
    const entityTypeElements = xmlDoc.querySelectorAll('EntityType');
    entityTypeElements.forEach((entityTypeEl) => {
      const name = entityTypeEl.getAttribute('Name') || '';
      
      // Processar Properties
      const properties: Property[] = [];
      entityTypeEl.querySelectorAll('Property').forEach((propEl) => {
        properties.push({
          name: propEl.getAttribute('Name') || '',
          type: (propEl.getAttribute('Type') || '').replace('Edm.', ''),
          nullable: propEl.getAttribute('Nullable') !== 'false'
        });
      });
      
      // Processar Navigation Properties
      const navigationProperties: NavigationProperty[] = [];
      entityTypeEl.querySelectorAll('NavigationProperty').forEach((navPropEl) => {
        const typeAttr = navPropEl.getAttribute('Type') || '';
        const isCollection = typeAttr.startsWith('Collection');
        let targetEntity = typeAttr;
        
        // Extrair o tipo real da coleção se for Collection(Tipo)
        if (isCollection) {
          const match = targetEntity.match(/Collection\((.*)\)/);
          targetEntity = match ? match[1] : '';
        }
        
        const navProperty: NavigationProperty = {
          name: navPropEl.getAttribute('Name') || '',
          type: typeAttr,
          isCollection,
          targetEntity
        };
        
        // Adicionar referential constraint se existir
        const refConstraintEl = navPropEl.querySelector('ReferentialConstraint');
        if (refConstraintEl) {
          navProperty.referentialConstraint = {
            property: refConstraintEl.getAttribute('Property') || '',
            referencedProperty: refConstraintEl.getAttribute('ReferencedProperty') || ''
          };
        }
        
        navigationProperties.push(navProperty);
      });
      
      // Extrair Keys
      const keys: string[] = [];
      entityTypeEl.querySelectorAll('Key PropertyRef').forEach((keyRefEl) => {
        keys.push(keyRefEl.getAttribute('Name') || '');
      });
      
      // Adicionar o EntityType ao objeto
      entityTypes[name] = {
        name,
        properties,
        navigationProperties,
        key: keys
      };
    });
    
    // Processar EntitySets
    const entitySetElements = xmlDoc.querySelectorAll('EntitySet');
    entitySetElements.forEach((entitySetEl) => {
      const name = entitySetEl.getAttribute('Name') || '';
      const entityType = entitySetEl.getAttribute('EntityType') || '';
      
      // Processar Navigation Property Bindings
      const navigationPropertyBindings: { path: string; target: string }[] = [];
      entitySetEl.querySelectorAll('NavigationPropertyBinding').forEach((bindingEl) => {
        navigationPropertyBindings.push({
          path: bindingEl.getAttribute('Path') || '',
          target: bindingEl.getAttribute('Target') || ''
        });
      });
      
      // Adicionar o EntitySet ao objeto
      entitySets[name] = {
        name,
        entityType,
        navigationPropertyBindings
      };
    });
    
    // Log para debug
    console.log("EntityTypes processados:", Object.keys(entityTypes));
    console.log("EntitySets processados:", Object.keys(entitySets));
    
    // Associar EntityTypes com EntitySets para facilitar a navegação
    // EntityType names podem estar prefixados com namespace
    for (const [setName, entitySet] of Object.entries(entitySets)) {
      // Extrair apenas o nome da entidade sem o namespace
      const entityTypeName = entitySet.entityType.split('.').pop() || '';
      
      // Se não encontrarmos o entityType diretamente pelo nome completo, procuramos pelo nome sem namespace
      if (!entityTypes[entitySet.entityType] && entityTypes[entityTypeName]) {
        console.log(`Associando EntitySet ${setName} com EntityType ${entityTypeName}`);
        entitySet.entityType = entityTypeName;
      }
    }
    
    return { entityTypes, entitySets };
  } catch (error) {
    console.error('Erro ao processar metadados:', error);
    throw new Error('Falha ao processar metadados OData');
  }
};

// Função para verificar se existe um caminho válido entre duas entidades
export const isValidPath = (
  sourceEntity: string, 
  targetEntity: string, 
  metadata: ODataMetadata, 
  visited: Set<string> = new Set(),
  path: string[] = []
): string[] | null => {
  if (sourceEntity === targetEntity) {
    return [...path];
  }
  
  if (visited.has(sourceEntity)) {
    return null;
  }
  
  visited.add(sourceEntity);
  
  const entityType = Object.values(metadata.entityTypes)
    .find(et => et.name === sourceEntity.split('.').pop());
  
  if (!entityType) {
    return null;
  }
  
  for (const navProp of entityType.navigationProperties) {
    const newPath = [...path, navProp.name];
    const result = isValidPath(navProp.targetEntity, targetEntity, metadata, visited, newPath);
    if (result) {
      return result;
    }
  }
  
  return null;
}; 