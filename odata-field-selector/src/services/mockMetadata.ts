import { ODataMetadata } from '../types/odataTypes';

// Dados pré-processados do XML para evitar problemas com a biblioteca xml2js no navegador
export const mockMetadata: ODataMetadata = {
  entityTypes: {
    "DataBIWebAPI.Dominio.Inspecao.EquipeManutencao": {
      name: "EquipeManutencao",
      properties: [
        { name: "IdEquipeManutencao", type: "Edm.String", nullable: false },
        { name: "Empreendimento", type: "Edm.String", nullable: false },
        { name: "Nome", type: "Edm.String", nullable: false },
        { name: "Lider", type: "Edm.String", nullable: true },
        { name: "IntegranteDaEquipe", type: "Edm.String", nullable: true }
      ],
      navigationProperties: [
        { name: "PlanoAcaos", type: "Collection(DataBIWebAPI.Dominio.Inspecao.PlanoAcao)", isCollection: true, targetEntity: "DataBIWebAPI.Dominio.Inspecao.PlanoAcao" },
        { name: "Recomendacaos", type: "Collection(DataBIWebAPI.Dominio.Inspecao.Recomendacao)", isCollection: true, targetEntity: "DataBIWebAPI.Dominio.Inspecao.Recomendacao" }
      ],
      key: ["IdEquipeManutencao"]
    },
    "DataBIWebAPI.Dominio.Inspecao.PlanoAcao": {
      name: "PlanoAcao",
      properties: [
        { name: "IdPlanoAcao", type: "Edm.String", nullable: false },
        { name: "EquipeManutencaoId", type: "Edm.String", nullable: true },
        { name: "Empreendimento", type: "Edm.String", nullable: false },
        { name: "Identificador", type: "Edm.String", nullable: true },
        { name: "Status", type: "Edm.String", nullable: true },
        { name: "DataInicio", type: "Edm.DateTimeOffset", nullable: true },
        { name: "DataTermino", type: "Edm.DateTimeOffset", nullable: true },
        { name: "DataCriacao", type: "Edm.DateTimeOffset", nullable: false },
        { name: "NomeResponsavel", type: "Edm.String", nullable: true },
        { name: "NomeSolicitador", type: "Edm.String", nullable: true },
        { name: "Prioridade", type: "Edm.String", nullable: true },
        { name: "Estrutura", type: "Edm.String", nullable: true },
      ],
      navigationProperties: [
        { 
          name: "EquipeManutencao", 
          type: "DataBIWebAPI.Dominio.Inspecao.EquipeManutencao", 
          isCollection: false, 
          targetEntity: "DataBIWebAPI.Dominio.Inspecao.EquipeManutencao",
          referentialConstraint: {
            property: "EquipeManutencaoId",
            referencedProperty: "IdEquipeManutencao"
          }
        },
        { name: "RegistroCampos", type: "Collection(DataBIWebAPI.Dominio.Inspecao.RegistroCampo)", isCollection: true, targetEntity: "DataBIWebAPI.Dominio.Inspecao.RegistroCampo" },
        { name: "Recomendacaos", type: "Collection(DataBIWebAPI.Dominio.Inspecao.Recomendacao)", isCollection: true, targetEntity: "DataBIWebAPI.Dominio.Inspecao.Recomendacao" }
      ],
      key: ["IdPlanoAcao"]
    },
    "DataBIWebAPI.Dominio.Inspecao.Recomendacao": {
      name: "Recomendacao",
      properties: [
        { name: "IdRecomendacao", type: "Edm.String", nullable: false },
        { name: "PlanoAcaoId", type: "Edm.String", nullable: false },
        { name: "EquipeManutencaoId", type: "Edm.String", nullable: true },
        { name: "Empreendimento", type: "Edm.String", nullable: false },
        { name: "Identificador", type: "Edm.String", nullable: false },
        { name: "Descricao", type: "Edm.String", nullable: false },
        { name: "DataCriacao", type: "Edm.DateTimeOffset", nullable: false },
        { name: "DataInicioReal", type: "Edm.DateTimeOffset", nullable: true },
        { name: "DataTerminoReal", type: "Edm.DateTimeOffset", nullable: true },
        { name: "Status", type: "Edm.String", nullable: false },
        { name: "CorStatus", type: "Edm.String", nullable: true },
        { name: "TipoStatus", type: "Edm.String", nullable: true },
        { name: "DataInicioPlanejada", type: "Edm.DateTimeOffset", nullable: true },
        { name: "DataTerminoPlanejada", type: "Edm.DateTimeOffset", nullable: true },
        { name: "ResponsavelPeloCronograma", type: "Edm.String", nullable: true },
        { name: "ResponsavelPelaRecomendacao", type: "Edm.String", nullable: true },
        { name: "G", type: "Edm.Int32", nullable: true },
        { name: "U", type: "Edm.Int32", nullable: true },
        { name: "T", type: "Edm.Int32", nullable: true },
        { name: "PalavrasChaves", type: "Edm.String", nullable: true },
        { name: "DescricaoTipoOcorrencia", type: "Edm.String", nullable: true },
        { name: "SiglaTipoOcorrencia", type: "Edm.String", nullable: true },
        { name: "Orcamento", type: "Edm.Double", nullable: true },
        { name: "Estrutura", type: "Edm.String", nullable: true },
        { name: "Prioridade", type: "Edm.String", nullable: true }
      ],
      navigationProperties: [
        { 
          name: "PlanoAcao", 
          type: "DataBIWebAPI.Dominio.Inspecao.PlanoAcao", 
          isCollection: false, 
          targetEntity: "DataBIWebAPI.Dominio.Inspecao.PlanoAcao",
          referentialConstraint: {
            property: "PlanoAcaoId",
            referencedProperty: "IdPlanoAcao"
          }
        },
        { 
          name: "EquipeManutencao", 
          type: "DataBIWebAPI.Dominio.Inspecao.EquipeManutencao", 
          isCollection: false, 
          targetEntity: "DataBIWebAPI.Dominio.Inspecao.EquipeManutencao",
          referentialConstraint: {
            property: "EquipeManutencaoId",
            referencedProperty: "IdEquipeManutencao"
          }
        },
        { name: "RecomendacaoCampoAdicionals", type: "Collection(DataBIWebAPI.Dominio.Inspecao.RecomendacaoCampoAdicional)", isCollection: true, targetEntity: "DataBIWebAPI.Dominio.Inspecao.RecomendacaoCampoAdicional" },
        { name: "RegistroCampos", type: "Collection(DataBIWebAPI.Dominio.Inspecao.RegistroCampo)", isCollection: true, targetEntity: "DataBIWebAPI.Dominio.Inspecao.RegistroCampo" }
      ],
      key: ["IdRecomendacao"]
    },
    "DataBIWebAPI.Dominio.Inspecao.RecomendacaoCampoAdicional": {
      name: "RecomendacaoCampoAdicional",
      properties: [
        { name: "IdRecomendacaoPlanoAcaoCampoAdicional", type: "Edm.String", nullable: false },
        { name: "RecomendacaoId", type: "Edm.String", nullable: false },
        { name: "Empreendimento", type: "Edm.String", nullable: false },
        { name: "NomePergunta", type: "Edm.String", nullable: true },
        { name: "TipoPergunta", type: "Edm.String", nullable: true },
        { name: "Obrigatorio", type: "Edm.String", nullable: false },
        { name: "Valor", type: "Edm.String", nullable: true },
        { name: "Data", type: "Edm.DateTimeOffset", nullable: true },
        { name: "IntervaloDeDataInicio", type: "Edm.DateTimeOffset", nullable: true },
        { name: "IntervaloDeDataFim", type: "Edm.DateTimeOffset", nullable: true },
        { name: "NomeUsuario", type: "Edm.String", nullable: true }
      ],
      navigationProperties: [
        { 
          name: "RecomendacaoPlanoAcao", 
          type: "DataBIWebAPI.Dominio.Inspecao.Recomendacao", 
          isCollection: false, 
          targetEntity: "DataBIWebAPI.Dominio.Inspecao.Recomendacao",
          referentialConstraint: {
            property: "RecomendacaoId",
            referencedProperty: "IdRecomendacao"
          }
        }
      ],
      key: ["IdRecomendacaoPlanoAcaoCampoAdicional"]
    },
    "DataBIWebAPI.Dominio.Inspecao.RegistroCampo": {
      name: "RegistroCampo",
      properties: [
        { name: "IdRegistroCampo", type: "Edm.String", nullable: false },
        { name: "PlanoAcaoId", type: "Edm.String", nullable: true },
        { name: "RecomendacaoId", type: "Edm.String", nullable: true },
        { name: "Empreendimento", type: "Edm.String", nullable: false },
        { name: "Estrutura", type: "Edm.String", nullable: true },
        { name: "IdInspecao", type: "Edm.String", nullable: true },
        { name: "Latitude", type: "Edm.Double", nullable: true },
        { name: "Longitude", type: "Edm.Double", nullable: true },
        { name: "Sintoma", type: "Edm.String", nullable: true },
        { name: "PastaSintoma", type: "Edm.String", nullable: true },
        { name: "DataDeCriacao", type: "Edm.DateTimeOffset", nullable: false },
        { name: "G", type: "Edm.Int32", nullable: true },
        { name: "U", type: "Edm.Int32", nullable: true },
        { name: "T", type: "Edm.Int32", nullable: true },
        { name: "EAnomalia", type: "Edm.Boolean", nullable: false },
        { name: "Identificador", type: "Edm.String", nullable: true },
        { name: "Datum", type: "Edm.Int32", nullable: true },
        { name: "IdRegistroCampoAssociado", type: "Edm.String", nullable: true },
        { name: "ObservacaoDaLocalizacao", type: "Edm.String", nullable: true },
        { name: "Causa", type: "Edm.String", nullable: true },
        { name: "Mecanismo", type: "Edm.String", nullable: true },
        { name: "Origem", type: "Edm.String", nullable: true },
        { name: "Prognostico", type: "Edm.String", nullable: true },
        { name: "ModoDeFalha", type: "Edm.String", nullable: true },
        { name: "SequenciaDeInspecao", type: "Edm.Int32", nullable: true },
        { name: "IdChecklistInspecaoProgramada", type: "Edm.String", nullable: true }
      ],
      navigationProperties: [
        { 
          name: "PlanoAcao", 
          type: "DataBIWebAPI.Dominio.Inspecao.PlanoAcao", 
          isCollection: false, 
          targetEntity: "DataBIWebAPI.Dominio.Inspecao.PlanoAcao",
          referentialConstraint: {
            property: "PlanoAcaoId",
            referencedProperty: "IdPlanoAcao"
          }
        },
        { 
          name: "Recomendacao", 
          type: "DataBIWebAPI.Dominio.Inspecao.Recomendacao", 
          isCollection: false, 
          targetEntity: "DataBIWebAPI.Dominio.Inspecao.Recomendacao",
          referentialConstraint: {
            property: "RecomendacaoId",
            referencedProperty: "IdRecomendacao"
          }
        },
        { name: "RegistroCampoHistoricos", type: "Collection(DataBIWebAPI.Dominio.Inspecao.RegistroCampoHistorico)", isCollection: true, targetEntity: "DataBIWebAPI.Dominio.Inspecao.RegistroCampoHistorico" }
      ],
      key: ["IdRegistroCampo"]
    },
    "DataBIWebAPI.Dominio.Inspecao.RegistroCampoHistorico": {
      name: "RegistroCampoHistorico",
      properties: [
        { name: "IdRegistroCampoHistorico", type: "Edm.String", nullable: false },
        { name: "IdRegistroCampo", type: "Edm.String", nullable: false },
        { name: "Empreendimento", type: "Edm.String", nullable: false },
        { name: "IdInspecao", type: "Edm.String", nullable: true },
        { name: "Responsavel", type: "Edm.String", nullable: true },
        { name: "DataRegistro", type: "Edm.DateTimeOffset", nullable: false },
        { name: "DataDeSincronizacao", type: "Edm.DateTimeOffset", nullable: true },
        { name: "Magnitude", type: "Edm.String", nullable: true },
        { name: "CriticidadeNPA", type: "Edm.String", nullable: true },
        { name: "Situacao", type: "Edm.String", nullable: true },
        { name: "SiglaSituacao", type: "Edm.String", nullable: true },
        { name: "Observacao", type: "Edm.String", nullable: true }
      ],
      navigationProperties: [
        { 
          name: "RegistroCampo", 
          type: "DataBIWebAPI.Dominio.Inspecao.RegistroCampo", 
          isCollection: false, 
          targetEntity: "DataBIWebAPI.Dominio.Inspecao.RegistroCampo",
          referentialConstraint: {
            property: "IdRegistroCampo",
            referencedProperty: "IdRegistroCampo"
          }
        }
      ],
      key: ["IdRegistroCampoHistorico"]
    }
  },
  entitySets: {
    "EquipeManutencao": {
      name: "EquipeManutencao",
      entityType: "DataBIWebAPI.Dominio.Inspecao.EquipeManutencao",
      navigationPropertyBindings: [
        { path: "PlanoAcaos", target: "PlanoAcao" },
        { path: "Recomendacaos", target: "Recomendacao" }
      ]
    },
    "PlanoAcao": {
      name: "PlanoAcao",
      entityType: "DataBIWebAPI.Dominio.Inspecao.PlanoAcao",
      navigationPropertyBindings: [
        { path: "EquipeManutencao", target: "EquipeManutencao" },
        { path: "Recomendacaos", target: "Recomendacao" },
        { path: "RegistroCampos", target: "RegistroCampo" }
      ]
    },
    "Recomendacao": {
      name: "Recomendacao",
      entityType: "DataBIWebAPI.Dominio.Inspecao.Recomendacao",
      navigationPropertyBindings: [
        { path: "EquipeManutencao", target: "EquipeManutencao" },
        { path: "PlanoAcao", target: "PlanoAcao" },
        { path: "RecomendacaoCampoAdicionals", target: "RecomendacaoCampoAdicional" },
        { path: "RegistroCampos", target: "RegistroCampo" }
      ]
    },
    "RecomendacaoCampoAdicional": {
      name: "RecomendacaoCampoAdicional",
      entityType: "DataBIWebAPI.Dominio.Inspecao.RecomendacaoCampoAdicional",
      navigationPropertyBindings: [
        { path: "RecomendacaoPlanoAcao", target: "Recomendacao" }
      ]
    },
    "RegistroCampo": {
      name: "RegistroCampo",
      entityType: "DataBIWebAPI.Dominio.Inspecao.RegistroCampo",
      navigationPropertyBindings: [
        { path: "PlanoAcao", target: "PlanoAcao" },
        { path: "Recomendacao", target: "Recomendacao" },
        { path: "RegistroCampoHistoricos", target: "RegistroCampoHistorico" }
      ]
    },
    "RegistroCampoHistorico": {
      name: "RegistroCampoHistorico",
      entityType: "DataBIWebAPI.Dominio.Inspecao.RegistroCampoHistorico",
      navigationPropertyBindings: [
        { path: "RegistroCampo", target: "RegistroCampo" }
      ]
    }
  }
}; 