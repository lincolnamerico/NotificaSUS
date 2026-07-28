export interface KpiData {
  total: { hoje: number; "7d": number; "30d": number };
  porUsf: { nome: string; total: number }[];
  porGravidade: Record<string, number>;
  porTipo: { tipoIncidente: string; total: number }[];
  volumeTemporal: { data: string; total: number }[];
}
