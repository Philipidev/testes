import axios from 'axios';
import { EntitySet, EntityType, ODataMetadata } from '../types/odataTypes';
import { mockMetadata } from './mockMetadata';

// URL da API através do proxy do Vite para evitar problemas de CORS
const ODATA_METADATA_URL = 'https://databiapidev.sysdam.com.br/oDataInspecao/$metadata';
const USE_EXAMPLE_DATA = true; // Altere para false para usar a API real

export const fetchODataMetadata = async (): Promise<ODataMetadata> => {
  try {
    if (USE_EXAMPLE_DATA) {
      // Usar dados mockados diretamente
      console.log("Usando dados mockados");
      return mockMetadata;
    } else {
      // Fazer requisição à API real usando formato JSON
      const response = await axios.get(ODATA_METADATA_URL, {
        headers: { 
          'Accept': 'application/json;odata.metadata=minimal;odata.streaming=true'
        }
      });
      
      console.log("Resposta da API:", response.data);
      
      // Verificar se a resposta tem dados válidos
      if (response.data) {
        return parseJsonMetadata(response.data);
      } else {
        throw new Error('Resposta da API não contém dados válidos');
      }
    }
  } catch (error) {
    console.error('Erro ao carregar metadados:', error);
    throw new Error('Falha ao carregar metadados OData');
  }
};

// Função para processar metadados no formato JSON
const parseJsonMetadata = (data: Record<string, unknown>): ODataMetadata => {
  console.log("Analisando dados JSON:", data);
  
  const entityTypes: Record<string, EntityType> = {};
  const entitySets: Record<string, EntitySet> = {};
  
  // Implementação simplificada para evitar erros
  // Retorna uma estrutura básica que pode ser expandida conforme a resposta real
  
  return { entityTypes, entitySets };
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