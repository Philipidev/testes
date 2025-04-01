import { DataNode } from 'antd/es/tree';
import { EntitySet, EntityType, ODataMetadata } from '../types/odataTypes';

// Type for tree nodes
export interface TreeEntityNode extends DataNode {
  title: string;
  key: string;
  entityName?: string;
  propertyName?: string;
  isProperty?: boolean;
  isNavigation?: boolean;
  isCollection?: boolean;
  targetEntity?: string;
  parentPath?: string[];
  navigationPath?: string[];
  disabled?: boolean;
}

/**
 * Constrói a árvore inicial de EntitySets
 */
export function buildEntitySetsTree(metadata: ODataMetadata): TreeEntityNode[] {
  return Object.values(metadata.entitySets).map((entitySet) => {
    const entityTypeName = entitySet.entityType;
    
    // Handle fully qualified names - try both with and without namespace
    const shortTypeName = entityTypeName.split('.').pop() || entityTypeName;
    
    const entityType = Object.values(metadata.entityTypes).find(
      et => et.name === entityTypeName || et.name === shortTypeName
    );
    
    console.log(`EntitySet: ${entitySet.name}, EntityType: ${entityTypeName}, Found: ${entityType?.name || 'Not found'}`);
    
    const children: TreeEntityNode[] = [];
    
    if (entityType) {
      // Add properties as children
      entityType.properties.forEach(property => {
        children.push({
          title: `${property.name} (${property.type})`,
          key: `${entitySet.name}-prop-${property.name}`,
          entityName: entityType.name,
          propertyName: property.name,
          isProperty: true,
          parentPath: [entityType.name],
          navigationPath: [] // Empty for root level properties
        });
      });
      
      // Add navigation properties as children with their own children (to be loaded on expand)
      entityType.navigationProperties.forEach(navProp => {
        children.push({
          title: `${navProp.name}${navProp.isCollection ? ' (Coleção)' : ''}`,
          key: `${entitySet.name}-nav-${navProp.name}`,
          entityName: entityType.name,
          propertyName: navProp.name,
          isNavigation: true,
          isCollection: navProp.isCollection,
          targetEntity: navProp.targetEntity,
          children: [], // Will be loaded when expanded
          parentPath: [entityType.name],
          navigationPath: [navProp.name] // Start tracking the navigation path
        });
      });
    }
    
    return {
      title: entitySet.name,
      key: entitySet.name,
      entityName: entityType?.name,
      children
    };
  });
}

/**
 * Atualiza a árvore com novos filhos
 */
export function updateTreeData(list: TreeEntityNode[], key: React.Key, children: TreeEntityNode[]): TreeEntityNode[] {
  return list.map((node) => {
    if (node.key === key) {
      return {
        ...node,
        children,
      };
    }
    
    if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children as TreeEntityNode[], key, children),
      };
    }
    
    return node;
  });
}

/**
 * Verifica se um nó deve ser desabilitado com base na entidade raiz selecionada e caminhos de navegação ativos
 */
export function shouldDisableNode(
  node: TreeEntityNode, 
  selectedRootEntity: string | null, 
  activeNavigationPaths: Record<string, boolean>
): boolean {
  if (!selectedRootEntity) return false;
  
  const keyStr = node.key.toString();
  
  // If this is a root entity node and not the selected root entity, disable it
  if (!keyStr.includes('-') && keyStr !== selectedRootEntity) {
    return true;
  }
  
  // If this is a property or navigation of a different root entity, disable it
  if (keyStr.includes('-') && !keyStr.startsWith(selectedRootEntity)) {
    return true;
  }
  
  // For navigation property nodes, check if its parent path is active
  if (node.isNavigation && node.parentPath && node.parentPath.length > 1) {
    const parentPathKey = node.parentPath.join('/');
    return !activeNavigationPaths[parentPathKey];
  }
  
  // For property nodes, check if its parent path is active
  if (node.isProperty && node.parentPath && node.parentPath.length > 1) {
    const parentPathKey = node.parentPath.join('/');
    return !activeNavigationPaths[parentPathKey];
  }
  
  return false;
}

/**
 * Atualiza o status de desabilitado para todos os nós da árvore
 */
export function updateDisabledStatus(
  nodes: TreeEntityNode[], 
  selectedRootEntity: string | null, 
  activeNavigationPaths: Record<string, boolean>
): TreeEntityNode[] {
  return nodes.map(node => {
    const disabled = shouldDisableNode(node, selectedRootEntity, activeNavigationPaths);
    
    if (node.children) {
      return {
        ...node,
        disabled,
        children: updateDisabledStatus(node.children as TreeEntityNode[], selectedRootEntity, activeNavigationPaths)
      };
    }
    
    return { ...node, disabled };
  });
}

/**
 * Procura um nó na árvore pelo seu key
 */
export function findNode(nodes: TreeEntityNode[], key: string): TreeEntityNode | null {
  for (const node of nodes) {
    if (node.key === key) return node;
    if (node.children) {
      const found = findNode(node.children as TreeEntityNode[], key);
      if (found) return found;
    }
  }
  return null;
} 