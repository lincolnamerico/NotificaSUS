# PAPEL E PERFIL
Atue como um Arquiteto de Soluções de Software Sênior especialista em sistemas de saúde pública (HealthTech), com profundo conhecimento em normas da ANVISA (NotiVISA), LGPD (Lei Geral de Proteção de Dados) e infraestrutura para o Sistema Único de Saúde (SUS).

# CONTEXTO
A Secretaria de Saúde do Município de Pinhais/PR precisa implementar um sistema web para registro de incidentes e eventos adversos relacionados à segurança do paciente. O acesso ao sistema será feito prioritariamente por cidadãos e servidores via leitura de QR Codes impressos e afixados permanentemente nas recepções de todas as Unidades de Saúde da Família (USF) do município.

# OBJETIVO
Elaborar a especificação técnica e funcional detalhada (System Design Document) para o desenvolvimento dessa solução, garantindo interoperabilidade com o NotiVISA, conformidade com a LGPD e facilidade de acesso via mobile.

# REQUISITOS OBRIGATÓRIOS E RESTRIÇÕES DE LIMITE
1. **QR Code Estático e Perpétuo:** A URL codificada no QR Code deve ser definitiva e direta (ou utilizar redirecionador próprio sob domínio oficial da Prefeitura), proibindo o uso de encurtadores de terceiros com risco de expiração ou cobrança.
2. **Anonimato e LGPD:** O formulário deve oferecer um botão de alternância (toggle) para "Registro Anônimo". Se ativado, nenhuma informação de identificação (IP, e-mail, nome, telefone) deve ser persistida no banco de dados.
3. **Compatibilidade NotiVISA:** Os campos do formulário devem mapear perfeitamente a estrutura de dados exigida pelo NotiVISA para simplificar a exportação/integração futura (CSV/JSON/API).
4. **Mobile-First & Acessibilidade:** Interface leve, responsiva e otimizada para conexões móveis variadas nas recepções das USFs.
5. **Dashboards e Relatórios:** Módulo gerencial restrito com visão por USF, indicadores em tempo real e agendamento de relatórios mensais automáticos em PDF/XLSX.

# ESTRUTURA DE EXECUÇÃO (PASSO A PASSO)
Gere a especificação técnica dividida estritamente nas seguintes seções:

1. **Visão Geral da Arquitetura do Sistema**
   - Diagrama textual do fluxo de dados (Usuário $\rightarrow$ QR Code $\rightarrow$ WebApp $\rightarrow$ Banco de Dados $\rightarrow$ Dashboard Gerencial).
   - Sugestão de stack tecnológica otimizada para o setor público (baixo custo, alta escala e segurança).

2. **Modelagem do Formulário e Mapeamento NotiVISA**
   - Tabela contendo: [Nome do Campo] | [Tipo de Dado] | [Obrigatório? (S/N)] | [Equivalência no NotiVISA].
   - Incluir campos para: Identificação da USF, Tipo de Incidente, Data/Hora, Descrição, Grau do Dano e Ações Imediatas Tomadas.

3. **Estratégia de QR Code e Roteamento**
   - Especificação técnica para geração e fixação dos QR Codes permanentes.
   - Mecanismo de passagem de parâmetros na URL para preenchimento automático da USF de origem (ex: `.../notificar?usf_id=12`).

4. **Arquitetura de Segurança, Anonimização e LGPD**
   - Protocolo de tratamento dos dados sensíveis e anonimização de registros.
   - Termo de Consentimento e Privacidade simplificado para exibição no formulário.

5. **Módulo de BI, Dashboard e Relatórios Automatizados**
   - Especificação do Dashboard por Unidade de Saúde (KPIs de incidentes, gravidade e volume temporal).
   - Mecanismo de geração e envio automático de relatórios mensais para a gestão.

# TOM E ESTILO
Apresente uma resposta estritamente técnica, objetiva, altamente estruturada e pronta para ser entregue à equipe de engenharia de software da prefeitura.