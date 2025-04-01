import { SelectedField } from '../types/odataTypes';

interface SelectedFieldsListProps {
  selectedFields: SelectedField[];
  onRemoveField: (index: number) => void;
}

const SelectedFieldsList = ({ selectedFields, onRemoveField }: SelectedFieldsListProps) => {
  if (selectedFields.length === 0) {
    return (
      <div className="selected-fields">
        <h3>Campos selecionados</h3>
        <p>Nenhum campo selecionado</p>
      </div>
    );
  }

  return (
    <div className="selected-fields">
      <h3>Campos selecionados</h3>
      <ul className="selected-fields-list">
        {selectedFields.map((field, index) => (
          <li key={index} className="selected-field-item">
            <span>{field.displayName}</span>
            {field.path.length > 0 && (
              <span className="field-path">
                (Caminho: {field.path.join(' > ')})
              </span>
            )}
            <button 
              onClick={() => onRemoveField(index)} 
              className="remove-field-btn"
            >
              Remover
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SelectedFieldsList; 