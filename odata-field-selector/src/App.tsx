import './App.css';
import ODataFieldSelector from './components/ODataFieldSelector';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>OData Field Selector</h1>
        <p>Selecione os campos desejados da API OData</p>
      </header>
      
      <main className="app-content">
        <ODataFieldSelector />
      </main>
      
      <footer className="app-footer">
        <p>Desenvolvido com React, TypeScript e Vite</p>
      </footer>
    </div>
  );
}

export default App;
