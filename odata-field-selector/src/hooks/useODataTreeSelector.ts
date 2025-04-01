import { useState, useEffect } from 'react';
import { message } from 'antd';
import { ODataMetadata, SelectedField } from '../types/odataTypes';
import { 
  TreeEntityNode, 
  buildEntitySetsTree, 
  updateTreeData, 
  updateDisabledStatus, 
  findNode 
} from '../services/treeService';
import { generateODataQuery } from '../services/queryService';

interface UseODataTreeSelectorProps {
  metadata: ODataMetadata | null;
}

interface UseODataTreeSelectorResult {
  treeData: TreeEntityNode[];
  selectedFields: SelectedField[];
  expandedKeys: React.Key[];
  checkedKeys: React.Key[];
  selectedKeys: React.Key[];
  selectedRootEntity: string | null;
  odataQuery: string;
  showQuery: boolean;
  onLoadData: (node: TreeEntityNode) => Promise<void>;
  onExpand: (expandedKeys: React.Key[]) => void;
  onCheck: (checked: React.Key[] | { checked: React.Key[]; halfChecked: React.Key[] }) => void;
  onSelect: (selectedKeys: React.Key[], info: any) => void;
  generateQuery: () => void;
  resetSelections: () => void;
  removeField: (index: number) => void;
}

export function useODataTreeSelector({ metadata }: UseODataTreeSelectorProps): UseODataTreeSelectorResult {
  const [treeData, setTreeData] = useState<TreeEntityNode[]>([]);
  const [selectedFields, setSelectedFields] = useState<SelectedField[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [odataQuery, setOdataQuery] = useState<string>('');
  const [showQuery, setShowQuery] = useState(false);
  
  // Track selected root entity to enforce validation
  const [selectedRootEntity, setSelectedRootEntity] = useState<string | null>(null);
  // Track all the active navigation paths
  const [activeNavigationPaths, setActiveNavigationPaths] = useState<Record<string, boolean>>({});

  // Initialize tree data when metadata is loaded
  useEffect(() => {
    if (metadata) {
      const initialTreeData = buildEntitySetsTree(metadata);
      setTreeData(initialTreeData);
    }
  }, [metadata]);

  // Update disabled status when selected root entity or active paths change
  useEffect(() => {
    if (treeData.length === 0) return;
    
    const updatedTreeData = updateDisabledStatus(treeData, selectedRootEntity, activeNavigationPaths);
    setTreeData(updatedTreeData);
  }, [selectedRootEntity, activeNavigationPaths, treeData.length]);

  // Load children for navigation properties when expanded
  const onLoadData = (node: TreeEntityNode) => {
    return new Promise<void>(resolve => {
      if (node.children && node.children.length > 0) {
        resolve();
        return;
      }

      if (node.isNavigation && node.targetEntity && metadata) {
        // Find the target entity type
        // Handle fully qualified names - try both with and without namespace
        const shortTargetEntity = node.targetEntity.split('.').pop() || node.targetEntity;
        
        const targetEntityType = Object.values(metadata.entityTypes).find(
          et => et.name === node.targetEntity || et.name === shortTargetEntity
        );
        
        console.log(`Navigation to: ${node.targetEntity}, Found: ${targetEntityType?.name || 'Not found'}`);

        if (targetEntityType) {
          const newChildren: TreeEntityNode[] = [];
          const navPropName = node.key.toString().split('-nav-')[1];
          const newPath = [...(node.parentPath || []), navPropName];
          const newNavPath = [...(node.navigationPath || [])];
          
          // Add properties as children
          targetEntityType.properties.forEach(property => {
            newChildren.push({
              title: `${property.name} (${property.type})`,
              key: `${node.key}-prop-${property.name}`,
              entityName: targetEntityType.name,
              propertyName: property.name,
              isProperty: true,
              parentPath: newPath,
              navigationPath: newNavPath
            });
          });
          
          // Add navigation properties as children
          targetEntityType.navigationProperties.forEach(navProp => {
            // Clone the navigation path and add this navigation property
            const navPathForThisProperty = [...newNavPath, navProp.name];
            
            newChildren.push({
              title: `${navProp.name}${navProp.isCollection ? ' (Coleção)' : ''}`,
              key: `${node.key}-nav-${navProp.name}`,
              entityName: targetEntityType.name,
              propertyName: navProp.name,
              isNavigation: true,
              isCollection: navProp.isCollection,
              targetEntity: navProp.targetEntity,
              children: [], // Will be loaded when expanded
              parentPath: newPath,
              navigationPath: navPathForThisProperty
            });
          });
          
          const updatedTreeData = updateTreeData(treeData, node.key, newChildren);
          setTreeData(updatedTreeData);
        }
      }
      
      resolve();
    });
  };

  // Handle tree node selection (for tracking the root entity)
  const onSelect = (selectedKeys: React.Key[], info: any) => {
    setSelectedKeys(selectedKeys);
    
    if (selectedKeys.length > 0) {
      const key = selectedKeys[0].toString();
      
      // If a root entity is selected
      if (!key.includes('-')) {
        // If we already have a different root entity selected, show a warning
        if (selectedRootEntity && selectedRootEntity !== key) {
          message.warning('Você já tem uma entidade raiz selecionada. Remova os campos selecionados para escolher outra entidade.');
          return;
        }
        
        setSelectedRootEntity(key);
      }
    }
  };

  // Handle tree node check
  const onCheck = (checked: React.Key[] | { checked: React.Key[]; halfChecked: React.Key[] }) => {
    const checkedKeys = Array.isArray(checked) ? checked : checked.checked;
    setCheckedKeys(checkedKeys);
    
    // Update selected fields based on checked keys
    const newSelectedFields: SelectedField[] = [];
    // Track new active navigation paths
    const newActiveNavigationPaths: Record<string, boolean> = {};
    
    const processPaths = (node: TreeEntityNode) => {
      if (node.parentPath && node.parentPath.length > 0) {
        // Register all parent paths as active
        const pathKey = node.parentPath.join('/');
        newActiveNavigationPaths[pathKey] = true;
      }
    };
    
    checkedKeys.forEach(key => {
      const keyStr = key.toString();
      
      // Only process property nodes, not entity or navigation nodes
      if (keyStr.includes('-prop-')) {
        const node = findNode(treeData, keyStr);
        
        if (node && node.isProperty && node.entityName && node.propertyName) {
          // If we haven't set a root entity yet and this is a property of a root entity, set it
          if (!selectedRootEntity && !keyStr.includes('-nav-')) {
            const rootEntityKey = keyStr.split('-prop-')[0];
            setSelectedRootEntity(rootEntityKey);
          }
          
          const propertyPath = node.parentPath || [];
          const displayName = `${node.entityName}.${node.propertyName}`;
          
          processPaths(node);
          
          // Create a SelectedField with the navigationPath to preserve exact navigation property names
          newSelectedFields.push({
            entityName: node.entityName,
            propertyName: node.propertyName,
            displayName,
            path: propertyPath,
            navigationPath: node.navigationPath || []
          });
        }
      } else if (keyStr.includes('-nav-')) {
        // For navigation properties, just register their paths as active
        const node = findNode(treeData, keyStr);
        if (node) {
          processPaths(node);
        }
      } else if (!keyStr.includes('-') && !selectedRootEntity) {
        // If a root entity is checked and we don't have one yet, set it
        setSelectedRootEntity(keyStr);
      }
    });
    
    setSelectedFields(newSelectedFields);
    setActiveNavigationPaths(newActiveNavigationPaths);
  };

  // Handle tree expand/collapse
  const onExpand = (expandedKeys: React.Key[]) => {
    setExpandedKeys(expandedKeys);
  };

  // Generate OData query from selected fields
  const generateQuery = () => {
    const result = generateODataQuery(selectedFields, metadata, selectedRootEntity);
    
    if (result.error) {
      message.error(result.error);
    }
    
    setOdataQuery(result.query);
    setShowQuery(true);
  };

  // Reset all selections
  const resetSelections = () => {
    setSelectedRootEntity(null);
    setSelectedFields([]);
    setCheckedKeys([]);
    setSelectedKeys([]);
    setActiveNavigationPaths({});
    setShowQuery(false);
    
    // Reset tree data to initial state
    if (metadata) {
      const initialTreeData = buildEntitySetsTree(metadata);
      setTreeData(initialTreeData);
    }
  };

  // Remove a field from the selected fields list
  const removeField = (index: number) => {
    const newCheckedKeys = checkedKeys.filter(key => {
      const keyStr = key.toString();
      const fieldToRemove = selectedFields[index];
      return !keyStr.includes(`-prop-${fieldToRemove.propertyName}`);
    });
    setCheckedKeys(newCheckedKeys);
    
    const newSelectedFields = [...selectedFields];
    newSelectedFields.splice(index, 1);
    setSelectedFields(newSelectedFields);
    
    // If no more fields, reset the root entity
    if (newSelectedFields.length === 0) {
      setSelectedRootEntity(null);
      setActiveNavigationPaths({});
    }
  };

  return {
    treeData,
    selectedFields,
    expandedKeys,
    checkedKeys,
    selectedKeys,
    selectedRootEntity,
    odataQuery,
    showQuery,
    onLoadData,
    onExpand,
    onCheck,
    onSelect,
    generateQuery,
    resetSelections,
    removeField
  };
} 