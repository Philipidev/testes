import { Table, Button, Card } from 'antd';
import { SelectedField } from '../types/odataTypes';

interface SelectedFieldsTableProps {
  selectedFields: SelectedField[];
  onRemoveField: (index: number) => void;
  onGenerateQuery: () => void;
}

const SelectedFieldsTable = ({
  selectedFields,
  onRemoveField,
  onGenerateQuery
}: SelectedFieldsTableProps) => {
  // Table columns definition
  const columns = [
    {
      title: 'Entidade',
      dataIndex: 'entityName',
      key: 'entityName',
    },
    {
      title: 'Propriedade',
      dataIndex: 'propertyName',
      key: 'propertyName',
    },
    {
      title: 'Caminho',
      dataIndex: 'path',
      key: 'path',
      render: (path: string[]) => path.join(' > '),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, record: SelectedField, index: number) => (
        <Button 
          danger 
          onClick={() => onRemoveField(index)}
        >
          Remover
        </Button>
      ),
    },
  ];

  return (
    <Card title="Campos Selecionados" style={{ marginBottom: 16 }}>
      <Table 
        dataSource={selectedFields} 
        columns={columns} 
        rowKey={(record) => `${record.entityName}-${record.propertyName}-${record.displayName}`}
        pagination={false}
      />
      
      {selectedFields.length > 0 && (
        <Button 
          type="primary" 
          onClick={onGenerateQuery}
          style={{ marginTop: 16 }}
        >
          Gerar Consulta OData
        </Button>
      )}
    </Card>
  );
};

export default SelectedFieldsTable; 