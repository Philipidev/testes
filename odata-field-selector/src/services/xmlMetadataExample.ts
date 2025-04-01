export const exampleXmlMetadata = `<?xml version="1.0" encoding="utf-8"?>
<edmx:Edmx Version="4.0" xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx">
  <edmx:DataServices>
    <Schema Namespace="DataBIWebAPI.Dominio.Inspecao" xmlns="http://docs.oasis-open.org/odata/ns/edm">
      <EntityType Name="EquipeManutencao">
        <Key>
          <PropertyRef Name="IdEquipeManutencao" />
        </Key>
        <Property Name="IdEquipeManutencao" Type="Edm.String" Nullable="false" />
        <Property Name="Empreendimento" Type="Edm.String" Nullable="false" />
        <Property Name="Nome" Type="Edm.String" Nullable="false" />
        <Property Name="Lider" Type="Edm.String" />
        <Property Name="IntegranteDaEquipe" Type="Edm.String" />
        <NavigationProperty Name="PlanoAcaos" Type="Collection(DataBIWebAPI.Dominio.Inspecao.PlanoAcao)" />
        <NavigationProperty Name="Recomendacaos" Type="Collection(DataBIWebAPI.Dominio.Inspecao.Recomendacao)" />
      </EntityType>
      <EntityType Name="PlanoAcao">
        <Key>
          <PropertyRef Name="IdPlanoAcao" />
        </Key>
        <Property Name="IdPlanoAcao" Type="Edm.String" Nullable="false" />
        <Property Name="EquipeManutencaoId" Type="Edm.String" />
        <Property Name="Empreendimento" Type="Edm.String" Nullable="false" />
        <Property Name="Identificador" Type="Edm.String" />
        <Property Name="Status" Type="Edm.String" />
        <Property Name="DataInicio" Type="Edm.DateTimeOffset" />
        <Property Name="DataTermino" Type="Edm.DateTimeOffset" />
        <Property Name="DataCriacao" Type="Edm.DateTimeOffset" Nullable="false" />
        <Property Name="NomeResponsavel" Type="Edm.String" />
        <Property Name="NomeSolicitador" Type="Edm.String" />
        <Property Name="Prioridade" Type="Edm.String" />
        <Property Name="Estrutura" Type="Edm.String" />
        <NavigationProperty Name="EquipeManutencao" Type="DataBIWebAPI.Dominio.Inspecao.EquipeManutencao">
          <ReferentialConstraint Property="EquipeManutencaoId" ReferencedProperty="IdEquipeManutencao" />
        </NavigationProperty>
        <NavigationProperty Name="RegistroCampos" Type="Collection(DataBIWebAPI.Dominio.Inspecao.RegistroCampo)" />
        <NavigationProperty Name="Recomendacaos" Type="Collection(DataBIWebAPI.Dominio.Inspecao.Recomendacao)" />
      </EntityType>
      <EntityType Name="Recomendacao">
        <Key>
          <PropertyRef Name="IdRecomendacao" />
        </Key>
        <Property Name="IdRecomendacao" Type="Edm.String" Nullable="false" />
        <Property Name="PlanoAcaoId" Type="Edm.String" Nullable="false" />
        <Property Name="EquipeManutencaoId" Type="Edm.String" />
        <Property Name="Empreendimento" Type="Edm.String" Nullable="false" />
        <Property Name="Identificador" Type="Edm.String" Nullable="false" />
        <Property Name="Descricao" Type="Edm.String" Nullable="false" />
        <Property Name="DataCriacao" Type="Edm.DateTimeOffset" Nullable="false" />
        <Property Name="DataInicioReal" Type="Edm.DateTimeOffset" />
        <Property Name="DataTerminoReal" Type="Edm.DateTimeOffset" />
        <Property Name="Status" Type="Edm.String" Nullable="false" />
        <Property Name="CorStatus" Type="Edm.String" />
        <Property Name="TipoStatus" Type="Edm.String" />
        <Property Name="DataInicioPlanejada" Type="Edm.DateTimeOffset" />
        <Property Name="DataTerminoPlanejada" Type="Edm.DateTimeOffset" />
        <Property Name="ResponsavelPeloCronograma" Type="Edm.String" />
        <Property Name="ResponsavelPelaRecomendacao" Type="Edm.String" />
        <Property Name="G" Type="Edm.Int32" />
        <Property Name="U" Type="Edm.Int32" />
        <Property Name="T" Type="Edm.Int32" />
        <Property Name="PalavrasChaves" Type="Edm.String" />
        <Property Name="DescricaoTipoOcorrencia" Type="Edm.String" />
        <Property Name="SiglaTipoOcorrencia" Type="Edm.String" />
        <Property Name="Orcamento" Type="Edm.Double" />
        <Property Name="Estrutura" Type="Edm.String" />
        <Property Name="Prioridade" Type="Edm.String" />
        <NavigationProperty Name="PlanoAcao" Type="DataBIWebAPI.Dominio.Inspecao.PlanoAcao" Nullable="false">
          <ReferentialConstraint Property="PlanoAcaoId" ReferencedProperty="IdPlanoAcao" />
        </NavigationProperty>
        <NavigationProperty Name="EquipeManutencao" Type="DataBIWebAPI.Dominio.Inspecao.EquipeManutencao">
          <ReferentialConstraint Property="EquipeManutencaoId" ReferencedProperty="IdEquipeManutencao" />
        </NavigationProperty>
        <NavigationProperty Name="RecomendacaoCampoAdicionals" Type="Collection(DataBIWebAPI.Dominio.Inspecao.RecomendacaoCampoAdicional)" />
        <NavigationProperty Name="RegistroCampos" Type="Collection(DataBIWebAPI.Dominio.Inspecao.RegistroCampo)" />
      </EntityType>
      <EntityType Name="RecomendacaoCampoAdicional">
        <Key>
          <PropertyRef Name="IdRecomendacaoPlanoAcaoCampoAdicional" />
        </Key>
        <Property Name="IdRecomendacaoPlanoAcaoCampoAdicional" Type="Edm.String" Nullable="false" />
        <Property Name="RecomendacaoId" Type="Edm.String" Nullable="false" />
        <Property Name="Empreendimento" Type="Edm.String" Nullable="false" />
        <Property Name="NomePergunta" Type="Edm.String" />
        <Property Name="TipoPergunta" Type="Edm.String" />
        <Property Name="Obrigatorio" Type="Edm.String" Nullable="false" />
        <Property Name="Valor" Type="Edm.String" />
        <Property Name="Data" Type="Edm.DateTimeOffset" />
        <Property Name="IntervaloDeDataInicio" Type="Edm.DateTimeOffset" />
        <Property Name="IntervaloDeDataFim" Type="Edm.DateTimeOffset" />
        <Property Name="NomeUsuario" Type="Edm.String" />
        <NavigationProperty Name="RecomendacaoPlanoAcao" Type="DataBIWebAPI.Dominio.Inspecao.Recomendacao" Nullable="false">
          <ReferentialConstraint Property="RecomendacaoId" ReferencedProperty="IdRecomendacao" />
        </NavigationProperty>
      </EntityType>
      <EntityType Name="RegistroCampo">
        <Key>
          <PropertyRef Name="IdRegistroCampo" />
        </Key>
        <Property Name="IdRegistroCampo" Type="Edm.String" Nullable="false" />
        <Property Name="PlanoAcaoId" Type="Edm.String" />
        <Property Name="RecomendacaoId" Type="Edm.String" />
        <Property Name="Empreendimento" Type="Edm.String" Nullable="false" />
        <Property Name="Estrutura" Type="Edm.String" />
        <Property Name="IdInspecao" Type="Edm.String" />
        <Property Name="Latitude" Type="Edm.Double" />
        <Property Name="Longitude" Type="Edm.Double" />
        <Property Name="Sintoma" Type="Edm.String" />
        <Property Name="PastaSintoma" Type="Edm.String" />
        <Property Name="DataDeCriacao" Type="Edm.DateTimeOffset" Nullable="false" />
        <Property Name="G" Type="Edm.Int32" />
        <Property Name="U" Type="Edm.Int32" />
        <Property Name="T" Type="Edm.Int32" />
        <Property Name="EAnomalia" Type="Edm.Boolean" Nullable="false" />
        <Property Name="Identificador" Type="Edm.String" />
        <Property Name="Datum" Type="Edm.Int32" />
        <Property Name="IdRegistroCampoAssociado" Type="Edm.String" />
        <Property Name="ObservacaoDaLocalizacao" Type="Edm.String" />
        <Property Name="Causa" Type="Edm.String" />
        <Property Name="Mecanismo" Type="Edm.String" />
        <Property Name="Origem" Type="Edm.String" />
        <Property Name="Prognostico" Type="Edm.String" />
        <Property Name="ModoDeFalha" Type="Edm.String" />
        <Property Name="SequenciaDeInspecao" Type="Edm.Int32" />
        <Property Name="IdChecklistInspecaoProgramada" Type="Edm.String" />
        <NavigationProperty Name="PlanoAcao" Type="DataBIWebAPI.Dominio.Inspecao.PlanoAcao">
          <ReferentialConstraint Property="PlanoAcaoId" ReferencedProperty="IdPlanoAcao" />
        </NavigationProperty>
        <NavigationProperty Name="Recomendacao" Type="DataBIWebAPI.Dominio.Inspecao.Recomendacao">
          <ReferentialConstraint Property="RecomendacaoId" ReferencedProperty="IdRecomendacao" />
        </NavigationProperty>
        <NavigationProperty Name="RegistroCampoHistoricos" Type="Collection(DataBIWebAPI.Dominio.Inspecao.RegistroCampoHistorico)" />
      </EntityType>
      <EntityType Name="RegistroCampoHistorico">
        <Key>
          <PropertyRef Name="IdRegistroCampoHistorico" />
        </Key>
        <Property Name="IdRegistroCampoHistorico" Type="Edm.String" Nullable="false" />
        <Property Name="IdRegistroCampo" Type="Edm.String" Nullable="false" />
        <Property Name="Empreendimento" Type="Edm.String" Nullable="false" />
        <Property Name="IdInspecao" Type="Edm.String" />
        <Property Name="Responsavel" Type="Edm.String" />
        <Property Name="DataRegistro" Type="Edm.DateTimeOffset" Nullable="false" />
        <Property Name="DataDeSincronizacao" Type="Edm.DateTimeOffset" />
        <Property Name="Magnitude" Type="Edm.String" />
        <Property Name="CriticidadeNPA" Type="Edm.String" />
        <Property Name="Situacao" Type="Edm.String" />
        <Property Name="SiglaSituacao" Type="Edm.String" />
        <Property Name="Observacao" Type="Edm.String" />
        <NavigationProperty Name="RegistroCampo" Type="DataBIWebAPI.Dominio.Inspecao.RegistroCampo" Nullable="false">
          <ReferentialConstraint Property="IdRegistroCampo" ReferencedProperty="IdRegistroCampo" />
        </NavigationProperty>
      </EntityType>
    </Schema>
    <Schema Namespace="Default" xmlns="http://docs.oasis-open.org/odata/ns/edm">
      <EntityContainer Name="Container">
        <EntitySet Name="EquipeManutencao" EntityType="DataBIWebAPI.Dominio.Inspecao.EquipeManutencao">
          <NavigationPropertyBinding Path="PlanoAcaos" Target="PlanoAcao" />
          <NavigationPropertyBinding Path="Recomendacaos" Target="Recomendacao" />
        </EntitySet>
        <EntitySet Name="PlanoAcao" EntityType="DataBIWebAPI.Dominio.Inspecao.PlanoAcao">
          <NavigationPropertyBinding Path="EquipeManutencao" Target="EquipeManutencao" />
          <NavigationPropertyBinding Path="Recomendacaos" Target="Recomendacao" />
          <NavigationPropertyBinding Path="RegistroCampos" Target="RegistroCampo" />
        </EntitySet>
        <EntitySet Name="Recomendacao" EntityType="DataBIWebAPI.Dominio.Inspecao.Recomendacao">
          <NavigationPropertyBinding Path="EquipeManutencao" Target="EquipeManutencao" />
          <NavigationPropertyBinding Path="PlanoAcao" Target="PlanoAcao" />
          <NavigationPropertyBinding Path="RecomendacaoCampoAdicionals" Target="RecomendacaoCampoAdicional" />
          <NavigationPropertyBinding Path="RegistroCampos" Target="RegistroCampo" />
        </EntitySet>
        <EntitySet Name="RecomendacaoCampoAdicional" EntityType="DataBIWebAPI.Dominio.Inspecao.RecomendacaoCampoAdicional">
          <NavigationPropertyBinding Path="RecomendacaoPlanoAcao" Target="Recomendacao" />
        </EntitySet>
        <EntitySet Name="RegistroCampo" EntityType="DataBIWebAPI.Dominio.Inspecao.RegistroCampo">
          <NavigationPropertyBinding Path="PlanoAcao" Target="PlanoAcao" />
          <NavigationPropertyBinding Path="Recomendacao" Target="Recomendacao" />
          <NavigationPropertyBinding Path="RegistroCampoHistoricos" Target="RegistroCampoHistorico" />
        </EntitySet>
        <EntitySet Name="RegistroCampoHistorico" EntityType="DataBIWebAPI.Dominio.Inspecao.RegistroCampoHistorico">
          <NavigationPropertyBinding Path="RegistroCampo" Target="RegistroCampo" />
        </EntitySet>
      </EntityContainer>
    </Schema>
  </edmx:DataServices>
</edmx:Edmx>
`; 