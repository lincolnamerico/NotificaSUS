import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/lib/db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seed() {
  console.log("🌱 Seeding NotificaSUS database...");

  await db.delete(schema.notificacao);
  await db.delete(schema.usf);

  console.log("  🗑️ Dados anteriores removidos");

  const usfs = await db
    .insert(schema.usf)
    .values([
      { slug: "usf-ana-nery", nome: "USF Ana Nery", endereco: "Rua Jacarezinho, 1945 - Alto Tarumã", ativo: true },
      { slug: "usf-esplanada", nome: "USF Esplanada", endereco: "Rua Gana, 126 - Centro", ativo: true },
      { slug: "usf-jardim-karla", nome: "USF Jardim Karla", endereco: "Estrada Ecológica de Pinhais, 3158 - Jardim Karla", ativo: true },
      { slug: "usf-maria-antonieta", nome: "USF Maria Antonieta", endereco: "Rua Jerônimo Mendes dos Santos, 506 - Maria Antonieta", ativo: true },
      { slug: "usf-perdizes", nome: "USF Perdizes", endereco: "Rua Crescêncio Batista, 514 - Atuba", ativo: true },
      { slug: "usf-perneta", nome: "USF Perneta", endereco: "Rua Maximiliano Rohrsetzer, 983 - Emiliano Perneta", ativo: true },
      { slug: "usf-taruma", nome: "USF Tarumã", endereco: "Rua Guilherme Weiss, 500 - Vila Tarumã", ativo: true },
      { slug: "usf-tebas", nome: "USF Tebas", endereco: "Avenida Juriti, 132 - Jardim Cláudia", ativo: true },
      { slug: "usf-vargem-grande", nome: "USF Vargem Grande", endereco: "Rua Rio Azul, 320 - Vargem Grande", ativo: true },
      { slug: "usf-weissopolis", nome: "USF Weissópolis", endereco: "Rua Rio Trombetas, 888 - Weissópolis", ativo: true },
    ])
    .onConflictDoNothing({ target: schema.usf.slug })
    .returning();

  console.log(`  ✅ ${usfs.length} USFs inseridas`);

  const usuarios = await db
    .insert(schema.usuario)
    .values([
      { email: "lincoln.americo@gmail.com", nome: "Lincoln Américo", papel: "admin" },
      { email: "lincoln.rodrigues@pinhais.pr.gov.br", nome: "Lincoln Rodrigues", papel: "gestor" },
    ])
    .onConflictDoNothing({ target: schema.usuario.email })
    .returning();

  console.log(`  ✅ ${usuarios.length} usuários inseridos`);

  const usfsAtivas = await db.query.usf.findMany({ where: (u, { eq }) => eq(u.ativo, true) });
  const tipos = ["medicacao", "queda", "infeccao", "procedimento", "equipamento", "comunicacao", "sangue", "nutricao", "pele", "outro"] as const;
  const graus = ["leve", "moderado", "grave", "obito"] as const;
  const severidades = ["baixa", "media", "alta", "critica"] as const;
  const locais = ["Recepção", "Consultório", "Enfermaria", "Corredor", "Banheiro", "Quarto", "Farmácia", "Sala de Procedimentos"];

  const hoje = new Date();
  const notificacoes: (typeof schema.notificacao.$inferInsert)[] = [];

  for (let i = 0; i < 50; i++) {
    const usf = usfsAtivas[Math.floor(Math.random() * usfsAtivas.length)];
    const tipoIncidente = ["medicação", "queda de paciente", "falha de equipamento", "infecção hospitalar", "erro de procedimento", "comunicação falha", "incidente com sangue", "nutrição", "lesão de pele", "outro"][Math.floor(Math.random() * 10)];
    const classificacao = tipos[Math.floor(Math.random() * tipos.length)];
    const grau = graus[Math.floor(Math.random() * graus.length)];
    const severidade = severidades[Math.floor(Math.random() * severidades.length)];
    const local = locais[Math.floor(Math.random() * locais.length)];

    const diasAtras = Math.floor(Math.random() * 90);
    const data = new Date(hoje);
    data.setDate(data.getDate() - diasAtras);
    data.setHours(Math.floor(Math.random() * 12) + 8, Math.floor(Math.random() * 60));

    notificacoes.push({
      protocolo: `DEMO-${String(i + 1).padStart(4, "0")}`,
      usfId: usf.id,
      tipoIncidente,
      classificacaoIncidente: classificacao,
      localEspecifico: local,
      dataHora: data,
      descricao: `Notificação demonstrativa #${i + 1}: ${tipoIncidente} reportado(a) no(a) ${local} da ${usf.nome}.`,
      grauDano: grau,
      severidade,
      acoesTomadas: Math.random() > 0.3 ? ["Paciente encaminhado para avaliação.", "Notificado à chefia da unidade.", "Preenchido formulário de notificação interna.", "Aguardando análise da Comissão de Segurança do Paciente."][Math.floor(Math.random() * 4)] : null,
      anonimo: Math.random() > 0.4,
      createdAt: data,
    });
  }

  if (notificacoes.length > 0) {
    await db.insert(schema.notificacao).values(notificacoes);
  }

  console.log(`  ✅ ${notificacoes.length} notificações de demonstração inseridas`);
  console.log("🌱 Seed concluído com sucesso!");
}

seed()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .then(() => process.exit(0));
