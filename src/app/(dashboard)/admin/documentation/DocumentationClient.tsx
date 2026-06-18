"use client";

import { Printer, ArrowLeft, FileText, CheckCircle2, Server, Zap, Compass, ShieldAlert, Cpu } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DocumentationClient() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 relative overflow-hidden font-sans">
      {/* Watermark Logo behind content */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center opacity-[0.02] sm:opacity-[0.03] select-none"
        style={{
          backgroundImage: "url('/logo-ricas-new.png?v=7')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center 45%",
          backgroundSize: "650px",
        }}
      />

      {/* Main Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-10 print:p-0 print:max-w-full">
        
        {/* Print & Back Controls Header - Hidden in Print */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6 mb-8 print:hidden">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-all bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 rounded-lg px-3 py-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Painel
          </button>
          
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 transition-all rounded-lg px-4.5 py-2 shadow-lg shadow-cyan-600/20"
          >
            <Printer className="w-4 h-4" />
            Imprimir / Salvar PDF
          </button>
        </div>

        {/* PDF Document Page */}
        <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-8 sm:p-12 shadow-2xl print:bg-transparent print:border-none print:shadow-none print:p-0">
          
          {/* Document Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-800 pb-8 mb-8">
            <div className="flex flex-col">
              <h1 className="text-3xl font-extrabold text-white tracking-tight">DOCUMENTAÇÃO DO PORTAL</h1>
              <p className="text-sm font-semibold text-cyan-400 mt-1 uppercase tracking-wider">Manual de Operações e Funcionalidades</p>
              <p className="text-xs text-slate-500 mt-1">Gerado em: {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            
            {/* Header Brand Logo (High Quality & Transparent) */}
            <div className="bg-slate-950 rounded-xl p-2.5 px-4.5 border border-slate-800 flex items-center justify-center shrink-0 shadow-md">
              <img 
                src="/logo-ricas-new.png?v=7" 
                alt="Aicon Ricas NOC Brasil"
                style={{ 
                  maxHeight: '44px',
                  imageRendering: '-webkit-optimize-contrast'
                }}
                className="w-auto object-contain"
              />
            </div>
          </div>

          {/* Section 1: Intro */}
          <div className="mb-10">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2 border-b border-slate-800 pb-1.5">
              <FileText className="w-5 h-5 text-cyan-400" />
              1. Visão Geral do Sistema
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              O **Portal Aicon Ricas NOC Brasil** é um ecossistema integrado de monitoramento de telecomunicações e infraestrutura crítica projetado para fornecer visibilidade em tempo real, gestão ativa de alarmes e controle operacional de ativos de rede de forma autônoma e descentralizada. 
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
              Desenvolvido com tecnologia de ponta, o portal serve como ponto único de controle para NOC (Network Operations Center), engenharia de campo e faturamento de energia, garantindo alta disponibilidade e resposta rápida a incidentes em locais de cobertura crítica de operadoras.
            </p>
          </div>

          {/* Section 2: Features Grid */}
          <div className="mb-10">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-800 pb-1.5">
              <CheckCircle2 className="w-5 h-5 text-cyan-400" />
              2. Principais Módulos e Funcionalidades
            </h2>
            
            <div className="space-y-6">
              
              {/* Feature 1 */}
              <div>
                <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wide mb-1">2.1. Monitoramento DAS (SNMP) em Tempo Real</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Aquisição direta de telemetria de sinal de equipamentos **DAS (Distributed Antenna System)** das principais marcas do mercado (A-POI, Antenna Units - AU, Expansion Units - EU).
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-xs text-slate-400">
                  <li>Leitura instantânea de **Downlink Power, Uplink Power, RX Power, TX Power e Temperatura**.</li>
                  <li>Gráfico dinâmico de **Histórico de Telemetria** com filtros rápidos de períodos (Hoje, Ontem, Últimas 24h, 3 dias, 7 dias) e **Busca Personalizada por Período / Data**.</li>
                  <li>Sincronização em segundo plano automatizada de OIDs SNMP com tratamento de status offline de hardware.</li>
                </ul>
              </div>

              {/* Feature 2 */}
              <div>
                <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wide mb-1">2.2. Painel NOC de Alta Visibilidade (Modo TV)</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Módulo de tela cheia dedicado a monitores permanentes nas salas de operação (NOC) para monitoração ativa de falhas críticas.
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-xs text-slate-400">
                  <li>Exibição e som de alarmes de alta visibilidade em tempo real para qualquer sinal SNMP fora dos parâmetros normais.</li>
                  <li>Notificações e tratamento visual de alarmes de "Equipamento Inalcançável".</li>
                  <li>Sons e alarmes sonoros configurados especificamente para incidentes de energia e quedas de sinal.</li>
                </ul>
              </div>

              {/* Feature 3 */}
              <div>
                <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wide mb-1">2.3. Gestão e Faturamento de Energia (Medidores KRON)</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Monitoramento de consumo e faturamento de energia integrados com medidores da marca **KRON**.
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-xs text-slate-400">
                  <li>Cálculo de tarifas operacionais e geração automática de faturas em formato PDF pronto para impressão.</li>
                  <li>Armazenamento de leituras históricas de demanda e consumo.</li>
                </ul>
              </div>

              {/* Feature 4 */}
              <div>
                <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wide mb-1">2.4. Automação de Site Survey (Visualização CAD)</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Pipeline inteligente de visualização de plantas arquitetônicas e diagramas elétricos diretamente no portal.
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-xs text-slate-400">
                  <li>Visualização nativa em alta definição de arquivos de engenharia em formato **DXF**.</li>
                  <li>Alternância instantânea de temas (Dark Mode / Light Mode) para otimização de leitura de projetos e eliminação de invisibilidade de linhas pretas sobre fundos escuros.</li>
                </ul>
              </div>

              {/* Feature 5 */}
              <div>
                <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wide mb-1">2.5. Ordens de Serviço (O.S.) e Manutenção</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Sistema de chamados técnicos estruturado para equipes internas e de campo.
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-xs text-slate-400">
                  <li>Abertura, acompanhamento de status, atribuição técnica e finalização de ordens de serviço.</li>
                  <li>Geração automatizada de PDFs consolidados de incidentes para exportação rápida via WhatsApp.</li>
                </ul>
              </div>

              {/* Feature 6 */}
              <div>
                <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wide mb-1">2.6. Controle de Acesso, Licenças e Segurança</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Controle administrativo rígido de permissões e segurança operacional.
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-xs text-slate-400">
                  <li>Autenticação de usuários baseada em regras (ADMIN, TECHNICIAN, etc.).</li>
                  <li>Controle automático de bloqueio financeiro e prazos de vencimento de faturas de empresas parceiras.</li>
                  <li>Sincronização automatizada e badges visuais de controle de licenciamento corporativo (como antivírus Kaspersky) e mailboxes compartilhados de funcionários.</li>
                </ul>
              </div>

              {/* Feature 7 */}
              <div>
                <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wide mb-1">2.7. Monitoramento de No-Breaks FCC Alpha (SNMP, Traps & MQTT)</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Gestão integrada e diagnósticos avançados para os sistemas de energia e backup de baterias **FCC Alpha**.
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-xs text-slate-400">
                  <li>**Monitoramento Elétrico:** Aquisição via SNMP (comunidade <code>public</code>) de grandezas críticas como tensão de barramento, corrente de carga, tensão da rede AC e potência ativa.</li>
                  <li>**Gestão de Bateria:** Monitoramento do Estado de Carga (SOC %), temperatura, corrente de carga/recarga e tensão individual, com gráficos bidirecionais de ciclo de carga.</li>
                  <li>**Eventos em Tempo Real (Traps):** Integração instantânea com receptor de traps (porta 162 UDP) para alarmes ativos (Active) e limpezas (Cease) com disparos de WhatsApp e E-mail de forma automatizada.</li>
                  <li>**Conectividade MQTT:** Suporte nativo do equipamento para comunicação direta com brokers MQTT (porta 1883), otimizando tráfego de dados para locais remotos com internet via rádio ou satélite.</li>
                </ul>
              </div>

            </div>
          </div>

          {/* Section 3: Technical Specs */}
          <div className="mb-10 page-break-before">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2 border-b border-slate-800 pb-1.5">
              <Cpu className="w-5 h-5 text-cyan-400" />
              3. Arquitetura Técnica
            </h2>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                <span className="font-semibold text-slate-400 uppercase tracking-wider block mb-1">Frontend / Backend</span>
                <span className="text-slate-200">Next.js 13.5 (React 18 & Node.js)</span>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                <span className="font-semibold text-slate-400 uppercase tracking-wider block mb-1">Banco de Dados</span>
                <span className="text-slate-200">SQLite + Prisma ORM para acesso de baixa latência</span>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                <span className="font-semibold text-slate-400 uppercase tracking-wider block mb-1">Protocolos de Rede</span>
                <span className="text-slate-200">SNMP (v1/v2c/v3) + MQTT para automação industrial</span>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                <span className="font-semibold text-slate-400 uppercase tracking-wider block mb-1">Segurança / Auth</span>
                <span className="text-slate-200">Next-Auth (sessões criptografadas baseadas em cookies)</span>
              </div>
            </div>
          </div>

          {/* Section 4: Flowchart */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-slate-800 pb-1.5">
              <Compass className="w-5 h-5 text-cyan-400 animate-spin [animation-duration:20s]" />
              4. Fluxograma de Funcionamento
            </h2>
            
            <div className="space-y-8 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800 print:before:bg-slate-300">
              
              {/* Step 1: Ingestão */}
              <div className="relative">
                <div className="absolute -left-[22px] top-1.5 w-3 h-3 rounded-full bg-cyan-500 border border-slate-900 ring-4 ring-cyan-500/20 print:border-white print:ring-0"></div>
                <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2 print:text-cyan-600">Etapa 1: Ingestão e Integração de Dados</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  <div className="bg-slate-900/40 border border-slate-800/80 p-3 rounded-xl hover:border-cyan-500/40 transition-colors print:bg-slate-50 print:border-slate-200">
                    <span className="text-[11px] font-bold text-slate-200 block mb-1 print:text-slate-800">SNMP Telemetria</span>
                    <span className="text-[10px] text-slate-400 print:text-slate-600">Coleta ativa de alarmes, Downlink/Uplink Power e Temperatura dos dispositivos DAS.</span>
                  </div>
                  <div className="bg-slate-900/40 border border-slate-800/80 p-3 rounded-xl hover:border-yellow-500/40 transition-colors print:bg-slate-50 print:border-slate-200">
                    <span className="text-[11px] font-bold text-slate-200 block mb-1 print:text-slate-800">Medidores KRON</span>
                    <span className="text-[10px] text-slate-400 print:text-slate-600">Leituras de consumo e demanda elétrica para acompanhamento de custos.</span>
                  </div>
                  <div className="bg-slate-900/40 border border-slate-800/80 p-3 rounded-xl hover:border-blue-500/40 transition-colors print:bg-slate-50 print:border-slate-200">
                    <span className="text-[11px] font-bold text-slate-200 block mb-1 print:text-slate-800">CAD (DXF/DWG)</span>
                    <span className="text-[10px] text-slate-400 print:text-slate-600">Processamento e renderização WebGL de plantas arquitetônicas de Site Survey.</span>
                  </div>
                  <div className="bg-slate-900/40 border border-slate-800/80 p-3 rounded-xl hover:border-emerald-500/40 transition-colors print:bg-slate-50 print:border-slate-200">
                    <span className="text-[11px] font-bold text-slate-200 block mb-1 print:text-slate-800">Sincronização CSV</span>
                    <span className="text-[10px] text-slate-400 print:text-slate-600">Importação de licenças Kaspersky e status das caixas postais.</span>
                  </div>
                  <div className="bg-slate-900/40 border border-slate-800/80 p-3 rounded-xl hover:border-pink-500/40 transition-colors print:bg-slate-50 print:border-slate-200">
                    <span className="text-[11px] font-bold text-slate-200 block mb-1 print:text-slate-800">No-Breaks FCC</span>
                    <span className="text-[10px] text-slate-400 print:text-slate-600">Leituras SNMP e monitoramento de ciclos de baterias e rede elétrica AC.</span>
                  </div>
                </div>
              </div>

              {/* Step 2: Processamento */}
              <div className="relative">
                <div className="absolute -left-[22px] top-1.5 w-3 h-3 rounded-full bg-violet-500 border border-slate-900 ring-4 ring-violet-500/20 print:border-white print:ring-0"></div>
                <h3 className="text-xs font-bold text-violet-400 uppercase tracking-wider mb-2 print:text-violet-600">Etapa 2: Processamento Central e Persistência</h3>
                <div className="bg-slate-900/40 border border-slate-800/80 p-3.5 rounded-xl max-w-2xl hover:border-violet-500/40 transition-colors print:bg-slate-50 print:border-slate-200">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <span className="text-[11px] font-bold text-slate-200 block mb-1 print:text-slate-800">Next.js Backend & Banco de Dados</span>
                      <span className="text-[10px] text-slate-400 leading-relaxed block print:text-slate-600">
                        As rotas de API do Next.js gerenciam as sessões seguras do Next-Auth, orquestram o polling SNMP em segundo plano e salvam as leituras históricas e status no banco de dados SQLite por meio do Prisma ORM.
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-bold text-violet-300 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-md shrink-0 self-start md:self-auto print:bg-violet-50 print:text-violet-700 print:border-violet-200">
                      SQLite + Prisma
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Canais de Saída */}
              <div className="relative">
                <div className="absolute -left-[22px] top-1.5 w-3 h-3 rounded-full bg-emerald-500 border border-slate-900 ring-4 ring-emerald-500/20 print:border-white print:ring-0"></div>
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 print:text-emerald-600">Etapa 3: Canais de Visualização e Resposta</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-900/40 border border-slate-800/80 p-3 rounded-xl hover:border-cyan-500/40 transition-colors print:bg-slate-50 print:border-slate-200">
                    <span className="text-[11px] font-bold text-slate-200 block mb-1 print:text-slate-800">Dashboard Geral</span>
                    <span className="text-[10px] text-slate-400 print:text-slate-600">Interface principal com gráficos de telemetria, tabelas de alarmes históricos e busca dinâmica.</span>
                  </div>
                  <div className="bg-slate-900/40 border border-slate-800/80 p-3 rounded-xl hover:border-red-500/40 transition-colors print:bg-slate-50 print:border-slate-200">
                    <span className="text-[11px] font-bold text-slate-200 block mb-1 print:text-slate-800">NOC TV</span>
                    <span className="text-[10px] text-slate-400 print:text-slate-600">Modo TV de alta visibilidade com alertas pulsantes na tela e sinalização sonora para incidentes.</span>
                  </div>
                  <div className="bg-slate-900/40 border border-slate-800/80 p-3 rounded-xl hover:border-indigo-500/40 transition-colors print:bg-slate-50 print:border-slate-200">
                    <span className="text-[11px] font-bold text-slate-200 block mb-1 print:text-slate-800">Ordens de Serviço</span>
                    <span className="text-[10px] text-slate-400 print:text-slate-600">Geração de relatórios PDF de chamados técnicos estruturados para envio rápido no WhatsApp.</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Footer of PDF page */}
          <div className="border-t border-slate-800 pt-6 mt-8 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500">
            <span>&copy; {new Date().getFullYear()} Ricas Tecnologia e Grupo NOC Brasil. Todos os direitos reservados.</span>
            <span className="font-semibold text-cyan-500/80 print:text-cyan-600">Portal de Diagnóstico & Monitoramento de Redes</span>
          </div>

        </div>
      </div>

      {/* Special styles for window.print() */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:bg-transparent {
            background-color: transparent !important;
          }
          .print\\:border-none {
            border: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:p-0 {
            padding: 0 !important;
          }
          /* Ensure watermark prints nicely and stays faint */
          div[style*="backgroundImage"] {
            opacity: 0.04 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          h1, h2, h3, p, span, li, ul {
            color: black !important;
          }
          h1, h2 {
            border-color: #e2e8f0 !important;
          }
          .text-cyan-400, .text-cyan-300, .text-cyan-500\\/80 {
            color: #0891b2 !important;
          }
          .bg-slate-900\\/60, .bg-slate-900\\/40 {
            background-color: #f8fafc !important;
            border-color: #e2e8f0 !important;
          }
          .text-slate-400 {
            color: #475569 !important;
          }
        }
      `}</style>
    </div>
  );
}
