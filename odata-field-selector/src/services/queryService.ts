import { ODataMetadata, SelectedField } from '../types/odataTypes';

/**
 * Gera uma consulta OData com base nos campos selecionados
 */
export function generateODataQuery(
  selectedFields: SelectedField[], 
  metadata: ODataMetadata | null,
  selectedRootEntity: string | null
): { query: string; error?: string } {
  if (selectedFields.length === 0 || !metadata || !selectedRootEntity) {
    return { 
      query: '', 
      error: 'Selecione pelo menos um campo e uma entidade raiz para gerar a consulta.' 
    };
  }

  // Agrupar campos selecionados por entidade e pelo caminho completo
  // Usando navigationPath para preservar os nomes corretos das propriedades de navegação
  const fieldsByPath: Record<string, {entity: string, fields: string[], navPath: string[]}> = {};
  
  selectedFields.forEach(field => {
    // Criar uma chave baseada no caminho de navegação
    const pathKey = field.path.join('/');
    
    if (!fieldsByPath[pathKey]) {
      fieldsByPath[pathKey] = {
        entity: field.entityName,
        fields: [],
        navPath: field.navigationPath || []
      };
    }
    
    fieldsByPath[pathKey].fields.push(field.propertyName);
  });

  // Determinar a entidade raiz
  const rootEntitySetName = selectedRootEntity;
  
  if (!rootEntitySetName) {
    return {
      query: '',
      error: 'Não foi possível determinar a entidade raiz da consulta.'
    };
  }

  // Construir a parte de seleção de campos para a entidade raiz
  let select = '';
  const rootPathKey = Object.keys(fieldsByPath).find(path => path.split('/').length === 1) || '';
  
  if (rootPathKey && fieldsByPath[rootPathKey]) {
    select = fieldsByPath[rootPathKey].fields.join(',');
    delete fieldsByPath[rootPathKey];
  }

  // Construir a árvore de expansão usando os nomes de navegação preservados
  const buildExpansionTree = (paths: Record<string, {entity: string, fields: string[], navPath: string[]}>) => {
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
      // Usar o nome de navegação correto em vez do nome na path
      const navPath = paths[path].navPath;
      const navProp = navPath[navPath.length - 1]; // Último elemento é a propriedade de navegação atual
      
      // Obter os campos para esta entidade
      const fields = paths[path].fields;
      let expandItem = `${navProp}($select=${fields.join(',')}`; 
      
      // Procurar expansões filhas (qualquer caminho que comece com este caminho)
      const childPaths: Record<string, {entity: string, fields: string[], navPath: string[]}> = {};
      
      Object.keys(paths).forEach(childPath => {
        if (childPath !== path && childPath.startsWith(path + '/')) {
          // Cria um novo caminho relativo, removendo o início que já processamos
          const relativePath = childPath.substring(path.length + 1);
          // Precisamos calcular o novo navPath relativo também
          const relativeNavPath = paths[childPath].navPath.slice(navPath.length);
          childPaths[relativePath] = {
            entity: paths[childPath].entity,
            fields: paths[childPath].fields,
            navPath: relativeNavPath
          };
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

  // Gerar as expansões aninhadas usando a função recursiva e os nomes de navegação preservados
  const expand = buildExpansionTree(fieldsByPath);

  // Montar a consulta final
  let query = `${rootEntitySetName}?`;
  
  if (select) {
    query += `$select=${select}`;
  }
  
  if (expand.length > 0) {
    query += (select ? '&' : '') + `$expand=${expand.join(',')}`;
  }

  return { query };
} 