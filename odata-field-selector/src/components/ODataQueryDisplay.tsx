import { useState } from 'react';
import { Typography, Button, message } from 'antd';

const { Paragraph, Title } = Typography;

interface ODataQueryDisplayProps {
  queryString: string;
}

const ODataQueryDisplay = ({ queryString }: ODataQueryDisplayProps) => {
  const [messageApi, contextHolder] = message.useMessage();

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(queryString)
      .then(() => {
        messageApi.success('Copiado para a área de transferência!');
      })
      .catch(err => {
        messageApi.error('Falha ao copiar: ' + err);
        console.error('Falha ao copiar: ', err);
      });
  };

  return (
    <div className="odata-query-display">
      {contextHolder}
      <Title level={4}>Consulta OData gerada</Title>
      <div className="query-container">
        <Paragraph
          code
          copyable={false}
          style={{ 
            background: '#f5f5f5', 
            padding: '16px', 
            borderRadius: '4px',
            marginBottom: '16px'
          }}
        >
          {queryString}
        </Paragraph>
        <Button 
          type="primary"
          onClick={handleCopyToClipboard}
        >
          Copiar
        </Button>
      </div>
    </div>
  );
};

export default ODataQueryDisplay; 