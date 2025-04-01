import { Row, Col, Typography, Spin, Alert, Card } from 'antd';
import { useODataMetadata } from '../hooks/useODataMetadata';
import { useODataTreeSelector } from '../hooks/useODataTreeSelector';
import EntityTree from './EntityTree';
import SelectedFieldsTable from './SelectedFieldsTable';
import ODataQueryDisplay from './ODataQueryDisplay';

const { Title } = Typography;

const ODataFieldSelector = () => {
  // Carregar os metadados OData
  const { metadata, loading, error } = useODataMetadata();

  // Gerenciar a árvore e os campos selecionados
  const {
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
  } = useODataTreeSelector({ metadata });

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin tip="Carregando metadados OData...">
          <div className="content" style={{ padding: '50px', background: 'rgba(0, 0, 0, 0.05)', borderRadius: '4px' }} />
        </Spin>
      </div>
    );
  }

  if (error) {
    return <Alert message="Erro" description={error} type="error" />;
  }

  if (!metadata) {
    return <Alert message="Erro" description="Não foi possível carregar os metadados." type="error" />;
  }

  return (
    <div className="odata-field-selector">
      <Title level={2}>Seletor de Campos OData</Title>
      
      <Row gutter={24}>
        {/* Left side - Tree */}
        <Col span={12}>
          <EntityTree
            treeData={treeData}
            expandedKeys={expandedKeys}
            checkedKeys={checkedKeys}
            selectedKeys={selectedKeys}
            selectedRootEntity={selectedRootEntity}
            onLoadData={onLoadData}
            onExpand={onExpand}
            onCheck={onCheck}
            onSelect={onSelect}
            resetSelections={resetSelections}
          />
        </Col>
        
        {/* Right side - Selected fields table */}
        <Col span={12}>
          <SelectedFieldsTable 
            selectedFields={selectedFields}
            onRemoveField={removeField}
            onGenerateQuery={generateQuery}
          />
          
          {showQuery && (
            <Card title="Consulta OData">
              <ODataQueryDisplay queryString={odataQuery} />
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ODataFieldSelector; 