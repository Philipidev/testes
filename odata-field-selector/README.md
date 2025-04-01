# OData Field Selector

Uma aplicação React com TypeScript para selecionar campos de uma API OData, respeitando os relacionamentos entre entidades.

## Funcionalidades

- Análise de metadados OData para exibir entidades e seus campos
- Seleção de campos respeitando relações entre entidades
- Navegação entre entidades através de propriedades de navegação
- Validação de relacionamentos para evitar seleções inválidas
- Interface amigável para visualizar campos selecionados

## Tecnologias Utilizadas

- React 18
- TypeScript
- Vite
- axios para requisições HTTP
- xml2js para processamento de XML

## Instalação

```bash
# Clone o repositório
git clone [url-do-repositorio]
cd odata-field-selector

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

## Estrutura do Projeto

- `src/types`: Definições de tipos para metadados OData
- `src/services`: Serviços para buscar e processar metadados
- `src/components`: Componentes React para UI

## Como usar

1. A aplicação carrega os metadados da API OData automaticamente
2. Selecione uma entidade inicial (ex: RegistroCampo)
3. Selecione os campos desejados dessa entidade
4. Use as propriedades de navegação para acessar outras entidades relacionadas
5. Continue selecionando campos das entidades relacionadas
6. Os campos selecionados são exibidos em uma lista que pode ser gerenciada

## Modo de Desenvolvimento

Por padrão, a aplicação usa um exemplo de metadados OData para funcionar offline. Para usar a API real, edite `src/services/odataService.ts` e altere:

```typescript
const USE_EXAMPLE_DATA = false;
```

## Exemplos de Uso

- Selecionar campos relacionados diretamente (exemplo: RegistroCampo -> Identificador e Recomendacao -> Status)
- Navegação entre entidades (exemplo: RegistroCampo -> Recomendacao -> PlanoAcao -> EquipeManutencao)

## Licença

MIT
