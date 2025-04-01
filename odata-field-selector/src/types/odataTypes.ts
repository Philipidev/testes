// Interfaces que representam a estrutura do metadata OData

export interface Property {
  name: string;
  type: string;
  nullable: boolean;
}

export interface NavigationProperty {
  name: string;
  type: string;
  isCollection: boolean;
  targetEntity: string;
  referentialConstraint?: {
    property: string;
    referencedProperty: string;
  };
}

export interface EntityType {
  name: string;
  properties: Property[];
  navigationProperties: NavigationProperty[];
  key: string[];
}

export interface EntitySet {
  name: string;
  entityType: string;
  navigationPropertyBindings: {
    path: string;
    target: string;
  }[];
}

export interface ODataMetadata {
  entityTypes: Record<string, EntityType>;
  entitySets: Record<string, EntitySet>;
}

export interface SelectedField {
  entityName: string;
  propertyName: string;
  displayName: string;
  path: string[];
  navigationPath?: string[];
} 