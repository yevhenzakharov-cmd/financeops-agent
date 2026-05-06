export interface ClientInputFieldMapping {
  sourceField: string;
  normalizedField: string;
  required: boolean;
  notes?: string;
}

export interface ClientInputMapping {
  inputId: string;
  mappings: ClientInputFieldMapping[];
}
