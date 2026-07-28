interface PorGravidadeProps {
  dados: Record<string, number>;
}

const CORES: Record<string, string> = {
  leve: "#16a34a",
  moderado: "#e8c840",
  grave: "#ea580c",
  obito: "#dc2626",
};

const ROTULOS: Record<string, string> = {
  leve: "Leve",
  moderado: "Moderado",
  grave: "Grave",
  obito: "Óbito",
};

export function PorGravidade({ dados }: PorGravidadeProps) {
  const total = Object.values(dados).reduce((a, b) => a + b, 0);
  if (total === 0) {
    return (
      <div className="rounded-lg border border-primary/10 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-primary">
          Por Grau de Dano
        </h3>
        <p className="text-sm text-muted">Nenhum dado no período</p>
      </div>
    );
  }

  let offset = 0;
  const segments = Object.entries(dados)
    .filter(([, v]) => v > 0)
    .map(([key, valor]) => {
      const pct = (valor / total) * 100;
      const seg = { key, valor, pct, offset, cor: CORES[key] ?? "#ccc" };
      offset += pct;
      return seg;
    });

  return (
    <div className="rounded-lg border border-primary/10 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-primary">
        Por Grau de Dano
      </h3>
      <div className="flex items-center gap-4">
        <svg width="100" height="100" viewBox="0 0 100 100">
          {segments.map((s) => {
            const p = s.pct / 100;
            const r = 40;
            const circ = 2 * Math.PI * r;
            const dashLen = p * circ;
            const dashOff = -s.offset / 100 * circ;
            return (
              <circle
                key={s.key}
                cx="50"
                cy="50"
                r={r}
                fill="none"
                stroke={s.cor}
                strokeWidth="16"
                strokeDasharray={`${dashLen} ${circ - dashLen}`}
                strokeDashoffset={dashOff}
                transform="rotate(-90 50 50)"
              />
            );
          })}
        </svg>
        <div className="space-y-1">
          {Object.entries(dados).map(([key, valor]) => (
            <div key={key} className="flex items-center gap-2 text-sm">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: CORES[key] ?? "#ccc" }}
              />
              <span className="text-muted">{ROTULOS[key] ?? key}:</span>
              <span className="font-medium text-primary-dark">{valor}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
