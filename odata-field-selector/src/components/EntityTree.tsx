import { Tree, Card, Button, Space } from 'antd';
import { TreeEntityNode } from '../services/treeService';

interface EntityTreeProps {
  treeData: TreeEntityNode[];
  expandedKeys: React.Key[];
  checkedKeys: React.Key[];
  selectedKeys: React.Key[];
  selectedRootEntity: string | null;
  onLoadData: (node: TreeEntityNode) => Promise<void>;
  onExpand: (expandedKeys: React.Key[]) => void;
  onCheck: (checked: React.Key[] | { checked: React.Key[]; halfChecked: React.Key[] }) => void;
  onSelect: (selectedKeys: React.Key[], info: any) => void;
  resetSelections: () => void;
}

const EntityTree = ({
  treeData,
  expandedKeys,
  checkedKeys,
  selectedKeys,
  selectedRootEntity,
  onLoadData,
  onExpand,
  onCheck,
  onSelect,
  resetSelections
}: EntityTreeProps) => {
  return (
    <Card 
      title={
        <Space>
          Entidades e Propriedades
          {selectedRootEntity && (
            <span style={{ color: '#1890ff' }}>
              (Entidade raiz: {selectedRootEntity})
            </span>
          )}
        </Space>
      } 
      style={{ height: '100%' }}
      extra={
        <Button onClick={resetSelections} danger>Limpar seleções</Button>
      }
    >
      <Tree
        checkable
        selectable
        loadData={onLoadData}
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        onCheck={onCheck}
        checkedKeys={checkedKeys}
        onSelect={onSelect}
        selectedKeys={selectedKeys}
        treeData={treeData}
      />
    </Card>
  );
};

export default EntityTree; 