interface VolumeTemporalProps {
  dados: { data: string; total: number }[];
}

export function VolumeTemporal({ dados = [] }: VolumeTemporalProps) {
  if (!Array.isArray(dados) || dados.length === 0) {
    return (
      <div className="rounded-lg border border-primary/10 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-primary">
          Volume Temporal (30 dias)
        </h3>
        <p className="text-sm text-muted">Nenhum dado no período</p>
      </div>
    );
  }

  const maxTotal = Math.max(...dados.map((d) => d.total), 1);
  const width = 600;
  const height = 160;
  const padding = { top: 10, right: 10, bottom: 20, left: 10 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  if (dados.length === 1) {
    const y = padding.top + chartH - (dados[0].total / maxTotal) * chartH;
    const barW = chartW * 0.6;
    const x = padding.left + chartW / 2 - barW / 2;

    return (
      <div className="rounded-lg border border-primary/10 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-primary">
          Volume Temporal (30 dias)
        </h3>
        <svg width={width} height={height} className="w-full">
          <rect x={x} y={y} width={barW} height={chartH - (dados[0].total / maxTotal) * chartH} fill="#1a3a5c" rx="2" />
          <text x={padding.left + chartW / 2} y={height - 4} textAnchor="middle" className="fill-muted text-[10px]">
            {dados[0].data}
          </text>
        </svg>
      </div>
    );
  }

  const points = dados.map((d, i) => {
    const x = padding.left + (i / (dados.length - 1)) * chartW;
    const y = padding.top + chartH - (d.total / maxTotal) * chartH;
    return `${x},${y}`;
  });

  const areaPoints = [
    `${padding.left},${padding.top + chartH}`,
    ...points,
    `${padding.left + chartW},${padding.top + chartH}`,
  ];

  const labelEvery = Math.max(1, Math.floor(dados.length / 7));

  return (
    <div className="rounded-lg border border-primary/10 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-primary">
        Volume Temporal (30 dias)
      </h3>
      <svg width={width} height={height} className="w-full">
        <polygon
          points={areaPoints.join(" ")}
          fill="#1a3a5c"
          fillOpacity="0.08"
        />
        <polyline
          points={points.join(" ")}
          fill="none"
          stroke="#1a3a5c"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {dados.map((d, i) => {
          const x = padding.left + (i / (dados.length - 1)) * chartW;
          const y = padding.top + chartH - (d.total / maxTotal) * chartH;
          return (
            <circle key={d.data} cx={x} cy={y} r="3" fill="#1a3a5c" />
          );
        })}
        {dados
          .filter((_, i) => i % labelEvery === 0)
          .map((d, i) => {
            const idx = i * labelEvery;
            const x = padding.left + (idx / (dados.length - 1)) * chartW;
            return (
              <text
                key={d.data}
                x={x}
                y={height - 4}
                textAnchor="middle"
                className="fill-muted text-[10px]"
              >
                {d.data.slice(5)}
              </text>
            );
          })}
      </svg>
    </div>
  );
}
