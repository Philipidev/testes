import './App.css';
import { Layout, Typography } from 'antd';
import ODataFieldSelector from './components/ODataFieldSelector';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

function App() {
  return (
    <Layout className="app-container">
      <Header className="app-header" style={{ background: '#fff' }}>
        <Title level={1}>OData Field Selector</Title>
        <Paragraph>Selecione os campos desejados da API OData</Paragraph>
      </Header>
      
      <Content className="app-content">
        <ODataFieldSelector />
      </Content>
      
      <Footer className="app-footer">
        <Paragraph>Desenvolvido com React, TypeScript, Vite e Ant Design</Paragraph>
      </Footer>
    </Layout>
  );
}

export default App;
