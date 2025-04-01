import { useState } from 'react';

interface ODataQueryDisplayProps {
  queryString: string;
}

const ODataQueryDisplay = ({ queryString }: ODataQueryDisplayProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(queryString)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Falha ao copiar: ', err);
      });
  };

  return (
    <div className="odata-query-display">
      <h3>Consulta OData gerada</h3>
      <div className="query-container">
        <pre className="query-text">{queryString}</pre>
        <button 
          className="copy-button"
          onClick={handleCopyToClipboard}
        >
          {copied ? 'Copiado!' : 'Copiar'}
        </button>
      </div>
    </div>
  );
};

export default ODataQueryDisplay; 