"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  ArrowLeft, FileText, Printer, Calendar, DollarSign, 
  Building2, Zap, Activity, AlertCircle, Percent, RefreshCw, BarChart2
} from 'lucide-react';

interface Distributor {
  id: string;
  name: string;
  region: string;
  baseTariff: number;
  totalTariffWithTax: number;
  state: string;
}

interface KronDevice {
  id: string;
  name: string;
  serial: string;
  mqttTopic: string;
  location: string | null;
  company: { name: string } | null;
}

interface BillingData {
  device: KronDevice;
  startReading?: { receivedAt: string; energyActivePos: number };
  endReading?: { receivedAt: string; energyActivePos: number };
  consumptionKwh: number;
  baseTariff: number;
  calculations: {
    activeCost: number;
    pisCofinsEst: number;
    icmsEst: number;
    publicLightingEst: number;
    totalCost: number;
  };
  message?: string;
}

export default function KronBillingPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();

  // Estados principais
  const [device, setDevice] = useState<KronDevice | null>(null);
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [selectedDistributorId, setSelectedDistributorId] = useState('enel-sp');
  
  // Datas e Tarifas
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tariff, setTariff] = useState('0.738');
  
  // Impostos customizáveis
  const [icmsRate, setIcmsRate] = useState('18');
  const [pisCofinsRate, setPisCofinsRate] = useState('9.25');
  const [lightingFee, setLightingFee] = useState('15.40');

  // Envio manual de fatura por e-mail
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailFeedback, setEmailFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Resultados
  const [billing, setBilling] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inicialização
  useEffect(() => {
    // Define datas padrão (último mês)
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);

    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);

    async function loadData() {
      try {
        // 1. Carrega dados do dispositivo
        const resDev = await fetch(`/api/kron/devices/${id}?limit=1`);
        if (resDev.ok) {
          const dev = await resDev.json();
          setDevice(dev);
        } else {
          setError('Erro ao carregar medidor');
        }

        // 2. Carrega tarifas das distribuidoras de energia
        const resTariffs = await fetch('/api/kron/tariff');
        if (resTariffs.ok) {
          const data = await resTariffs.json();
          setDistributors(data.distributors || []);
          
          // Seleciona a tarifa inicial baseada em Enel SP
          const enel = data.distributors?.find((d: Distributor) => d.id === 'enel-sp');
          if (enel) {
            setTariff(enel.baseTariff.toString());
          }
        }
      } catch (e: any) {
        setError(e.message || 'Erro inesperado');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  // Altera tarifa quando muda distribuidora
  const handleDistributorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const distId = e.target.value;
    setSelectedDistributorId(distId);
    const dist = distributors.find(d => d.id === distId);
    if (dist) {
      setTariff(dist.baseTariff.toString());
    }
  };

  // Faz o cálculo
  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCalculating(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/kron/devices/${id}/billing?startDate=${startDate}T00:00:00.000Z&endDate=${endDate}T23:59:59.999Z&tariff=${tariff}`
      );
      if (res.ok) {
        const data = await res.json();
        
        // Recalcula impostos e custos usando os inputs personalizados do formulário
        const consumption = data.consumptionKwh || 0;
        const activeCost = consumption * parseFloat(tariff);
        const pisCofins = activeCost * (parseFloat(pisCofinsRate) / 100);
        const icms = activeCost * (parseFloat(icmsRate) / 100);
        const lighting = consumption > 0 ? parseFloat(lightingFee) : 0;
        const total = activeCost + pisCofins + icms + lighting;

        setBilling({
          ...data,
          calculations: {
            activeCost,
            pisCofinsEst: pisCofins,
            icmsEst: icms,
            publicLightingEst: lighting,
            totalCost: total
          }
        });
      } else {
        const errData = await res.json();
        setError(errData.error || 'Erro ao calcular faturamento');
      }
    } catch (e: any) {
      setError(e.message || 'Erro de rede');
    } finally {
      setCalculating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientEmail) return;
    setSendingEmail(true);
    setEmailFeedback(null);
    try {
      const res = await fetch(`/api/kron/devices/${id}/billing/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startDate: `${startDate}T00:00:00.000Z`,
          endDate: `${endDate}T23:59:59.999Z`,
          tariff,
          icmsRate,
          pisCofinsRate,
          lightingFee,
          recipientEmail
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEmailFeedback({ success: true, message: data.message });
      } else {
        setEmailFeedback({ success: false, message: data.error || 'Falha ao enviar e-mail' });
      }
    } catch (err: any) {
      setEmailFeedback({ success: false, message: err.message || 'Erro de conexão' });
    } finally {
      setSendingEmail(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-slate-400 gap-4">
        <RefreshCw className="w-8 h-8 animate-spin text-yellow-400" />
        <span className="font-semibold text-sm">Carregando dados para faturamento...</span>
      </div>
    );
  }

  if (!device) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h2 className="text-xl font-bold">Medidor não encontrado</h2>
        <Link href="/kron" className="text-yellow-400 hover:underline">Voltar para a lista</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estilo para impressão (A4 de alta fidelidade para Fatura) */}
      <style jsx global>{`
        @media print {
          /* Esconde elementos do painel que não pertencem à fatura */
          body * {
            visibility: hidden;
          }
          #invoice-printable, #invoice-printable * {
            visibility: visible;
          }
          #invoice-printable {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            color: black !important;
            box-shadow: none !important;
            border: none !important;
          }
          /* Remove margens extras */
          @page {
            size: A4;
            margin: 1.5cm;
          }
          /* Ajustes de cores para impressão no papel */
          .print-bg-dark {
            background-color: #f1f5f9 !important;
            color: #0f172a !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print-border {
            border: 1px solid #cbd5e1 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Header no-print */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-3">
            <Link href={`/kron/${id}`} className="p-2 bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <FileText className="w-6 h-6 text-cyan-400" />
              Simulador de Faturamento de Energia
            </h1>
          </div>
          <div className="flex items-center gap-4 mt-2 ml-14 text-sm text-slate-400">
            <span>🔌 Medidor: <strong className="text-white">{device.name}</strong></span>
            <span>SN: <strong className="text-white">{device.serial}</strong></span>
          </div>
        </div>
      </div>

      {/* Grid de Configurações no-print */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 no-print">
        
        {/* Formulário de Configuração */}
        <div className="lg:col-span-1 bg-slate-900/60 border border-slate-700/50 rounded-2xl p-5 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <BarChart2 className="w-4 h-4 text-yellow-400" />
            Parâmetros do Faturamento
          </h2>

          <form onSubmit={handleCalculate} className="space-y-4">
            {/* Datas */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Data Início</label>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-9 pr-2 text-sm text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Data Fim</label>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-9 pr-2 text-sm text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>
              </div>
            </div>

            {/* Distribuidora */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Distribuidora (Internet)</label>
              <select
                value={selectedDistributorId}
                onChange={handleDistributorChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2.5 px-3 text-sm text-white focus:outline-none focus:border-yellow-400"
              >
                {distributors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} (R$ {d.baseTariff.toFixed(3)}/kWh)
                  </option>
                ))}
              </select>
            </div>

            {/* Tarifa Base */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Tarifa Base (R$ / kWh)</label>
              <div className="relative">
                <DollarSign className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="number"
                  step="0.001"
                  required
                  value={tariff}
                  onChange={(e) => setTariff(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-9 pr-2 text-sm text-white font-mono focus:outline-none focus:border-yellow-400"
                  placeholder="Ex: 0.738"
                />
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3 my-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Impostos e Adicionais (Editável)</span>
            </div>

            {/* Impostos */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">ICMS (%)</label>
                <div className="relative">
                  <Percent className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-slate-600" />
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={icmsRate}
                    onChange={(e) => setIcmsRate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 pr-8 text-sm text-white font-mono focus:outline-none focus:border-yellow-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">PIS/COFINS (%)</label>
                <div className="relative">
                  <Percent className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-slate-600" />
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={pisCofinsRate}
                    onChange={(e) => setPisCofinsRate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 pr-8 text-sm text-white font-mono focus:outline-none focus:border-yellow-400"
                  />
                </div>
              </div>
            </div>

            {/* Iluminação Pública */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Taxa de Iluminação Pública (R$)</label>
              <div className="relative">
                <DollarSign className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="number"
                  step="0.01"
                  required
                  value={lightingFee}
                  onChange={(e) => setLightingFee(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-9 pr-2 text-sm text-white font-mono focus:outline-none focus:border-yellow-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={calculating}
              className="w-full py-3 mt-2 rounded-xl bg-yellow-500 text-slate-950 font-bold hover:bg-yellow-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/10 disabled:opacity-50"
            >
              {calculating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Calculando Consumo...
                </>
              ) : (
                <>
                  <Activity className="w-5 h-5" />
                  Calcular Fatura
                </>
              )}
            </button>
          </form>
        </div>

        {/* Resumo de Custos Lateral */}
        <div className="lg:col-span-2 flex flex-col justify-between bg-slate-900/60 border border-slate-700/50 rounded-2xl p-5">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              Resumo da Fatura Simulada
            </h2>

            {error && (
              <div className="mt-4 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {!billing && !error && (
              <div className="mt-12 flex flex-col items-center justify-center text-slate-500 gap-2.5">
                <Zap className="w-10 h-10 opacity-20 text-yellow-400 animate-pulse" />
                <p className="text-sm">Defina o período e clique em <strong>Calcular Fatura</strong> para analisar os custos.</p>
              </div>
            )}

            {billing && (
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Métricas de Consumo */}
                <div className="space-y-4">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Leituras de Medição</span>
                  
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-400">Leitura Inicial ({new Date(billing.startReading?.receivedAt || '').toLocaleDateString('pt-BR')})</div>
                    <div className="text-xl font-mono font-bold text-slate-200 mt-1">
                      {billing.startReading?.energyActivePos.toLocaleString('pt-BR', { minimumFractionDigits: 1 })} <span className="text-xs text-slate-500 font-normal">kWh</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-400">Leitura Final ({new Date(billing.endReading?.receivedAt || '').toLocaleDateString('pt-BR')})</div>
                    <div className="text-xl font-mono font-bold text-slate-200 mt-1">
                      {billing.endReading?.energyActivePos.toLocaleString('pt-BR', { minimumFractionDigits: 1 })} <span className="text-xs text-slate-500 font-normal">kWh</span>
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/20">
                    <div className="text-xs text-emerald-400 font-semibold uppercase">Consumo Ativo no Período</div>
                    <div className="text-3xl font-mono font-bold text-emerald-400 mt-1">
                      {billing.consumptionKwh.toLocaleString('pt-BR', { minimumFractionDigits: 1 })} <span className="text-lg font-normal">kWh</span>
                    </div>
                  </div>
                </div>

                {/* Demonstrativo Financeiro */}
                <div className="space-y-4">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Valores Estimados</span>
                  
                  <div className="space-y-2 text-sm text-slate-300">
                    <div className="flex justify-between">
                      <span>Custo de Consumo Ativo:</span>
                      <span className="font-mono text-slate-200">R$ {billing.calculations.activeCost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ICMS ({icmsRate}%):</span>
                      <span className="font-mono text-slate-400">R$ {billing.calculations.icmsEst.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>PIS/COFINS ({pisCofinsRate}%):</span>
                      <span className="font-mono text-slate-400">R$ {billing.calculations.pisCofinsEst.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-2">
                      <span>Contribuição Custeio Iluminação Pública:</span>
                      <span className="font-mono text-slate-400">R$ {billing.calculations.publicLightingEst.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-base font-bold text-white">Valor Total da Fatura:</span>
                      <span className="text-2xl font-mono font-bold text-yellow-400">
                        R$ {billing.calculations.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {billing && (
            <div className="mt-6 flex flex-col items-end gap-3 no-print">
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-end">
                {emailModalOpen ? (
                  <form onSubmit={handleSendEmail} className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800 w-full sm:max-w-md">
                    <input
                      type="email"
                      required
                      placeholder="email@destinatario.com"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      className="flex-1 bg-transparent border-none text-sm text-white focus:outline-none px-2 py-1"
                    />
                    <button
                      type="submit"
                      disabled={sendingEmail}
                      className="bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 transition-all"
                    >
                      {sendingEmail ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        "Enviar"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEmailModalOpen(false);
                        setEmailFeedback(null);
                      }}
                      className="text-slate-400 hover:text-white px-2 py-1 text-xs"
                    >
                      Cancelar
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => {
                      if (session?.user?.email) {
                        setRecipientEmail(session.user.email);
                      }
                      setEmailModalOpen(true);
                      setEmailFeedback(null);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 text-slate-200 font-bold hover:bg-slate-700 hover:text-white transition-all border border-slate-700/60"
                  >
                    <FileText className="w-4 h-4 text-yellow-400" />
                    Enviar por E-mail
                  </button>
                )}
                
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/10"
                >
                  <Printer className="w-4 h-4" />
                  Visualizar e Imprimir Fatura PDF
                </button>
              </div>

              {emailFeedback && (
                <div className={`text-xs font-semibold px-4 py-2 rounded-lg w-full sm:max-w-md ${emailFeedback.success ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                  {emailFeedback.message}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* FATURA FORMATADA PARA A4 E IMPRESSÃO */}
      {billing && (
        <div className="pt-4 border-t border-slate-800/80">
          <div className="no-print mb-3 text-center">
            <span className="text-xs text-slate-500 uppercase tracking-widest block">Pré-visualização da Fatura Oficial de Cobrança</span>
          </div>

          <div
            id="invoice-printable"
            className="mx-auto max-w-4xl bg-white text-slate-900 border border-slate-300 rounded-lg p-8 shadow-2xl transition-all"
          >
            {/* Cabeçalho da Fatura */}
            <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-6 border-b-2 border-slate-800 pb-6">
              
              {/* Ricas Tecnologia Logo & Info */}
              <div className="flex items-center gap-4">
                {/* Logotipo da Ricas feito em SVG fiel à imagem enviada */}
                <div className="w-16 h-16 shrink-0 print-bg-dark rounded-2xl flex items-center justify-center" style={{ background: 'radial-gradient(circle, #0055ff 0%, #002299 100%)' }}>
                  <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 33 22 L 58 22 C 68 22, 73 27, 73 35 C 73 42, 68 47, 58 47 L 46 47 L 46 78 L 33 78 Z M 46 32 L 46 40 L 56 40 C 60 40, 62 38, 62 36 C 62 34, 60 32, 56 32 Z M 52 47 L 71 78 L 86 78 L 63 47 Z" fill="#ffffff" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-blue-900">RICAS TECNOLOGIA</h2>
                  <p className="text-xs text-slate-500 font-medium uppercase mt-0.5">Soluções em Automação & Conectividade</p>
                  <p className="text-xs text-slate-400 mt-1 font-mono">CNPJ: 12.345.678/0001-90 | www.ricas.com.br</p>
                </div>
              </div>

              {/* Título do Documento */}
              <div className="text-right">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-900 font-bold rounded text-xs uppercase tracking-wider mb-2">
                  Fatura de Consumo Interno
                </span>
                <div className="text-slate-400 text-xs">Fatura Nº <strong className="text-slate-800">#KRON-{device.serial}-{new Date(endDate).getFullYear()}{String(new Date(endDate).getMonth()+1).padStart(2,'0')}</strong></div>
                <div className="text-slate-400 text-xs mt-1">Emissão: <strong className="text-slate-800">{new Date().toLocaleDateString('pt-BR')}</strong></div>
              </div>
            </div>

            {/* Informações de Cliente e Medidor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-b border-slate-200 text-sm">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Destinatário / Unidade</span>
                <div className="text-base font-extrabold text-slate-800">{device.company?.name || 'Ricas Tecnologia — Interno'}</div>
                {device.location && <div className="text-slate-600">📍 Localização: {device.location}</div>}
                <div className="text-slate-500">Unidade de Consumo vinculada à infraestrutura de monitoramento local.</div>
              </div>

              <div className="space-y-1 md:text-right font-mono">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Dados de Medição Técnica</span>
                <div className="text-slate-700">Equipamento: <strong className="text-slate-900 font-bold">{device.name}</strong></div>
                <div className="text-slate-700">Número de Série: <strong className="text-slate-900 font-bold">{device.serial}</strong></div>
                <div className="text-slate-700">Período de Apuração: <strong className="text-slate-900 font-bold">{new Date(startDate).toLocaleDateString('pt-BR')} a {new Date(endDate).toLocaleDateString('pt-BR')}</strong></div>
              </div>
            </div>

            {/* Detalhamento do Consumo */}
            <div className="py-6">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">Detalhamento das Leituras e Consumo</span>
              
              <table className="w-full text-sm text-left border border-slate-200">
                <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold text-xs uppercase">
                  <tr>
                    <th className="py-3 px-4">Grandeza Elétrica</th>
                    <th className="py-3 px-4 text-right">Leitura Inicial (Data)</th>
                    <th className="py-3 px-4 text-right">Leitura Final (Data)</th>
                    <th className="py-3 px-4 text-right">Consumo Registrado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700 font-mono">
                  <tr>
                    <td className="py-3 px-4 font-sans font-semibold text-slate-800">
                      ⚡ Energia Ativa Positiva (kWh)
                    </td>
                    <td className="py-3 px-4 text-right">
                      {billing.startReading?.energyActivePos.toLocaleString('pt-BR', { minimumFractionDigits: 1 })}
                      <div className="text-[10px] text-slate-400 font-sans mt-0.5">({new Date(billing.startReading?.receivedAt || '').toLocaleDateString('pt-BR')})</div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {billing.endReading?.energyActivePos.toLocaleString('pt-BR', { minimumFractionDigits: 1 })}
                      <div className="text-[10px] text-slate-400 font-sans mt-0.5">({new Date(billing.endReading?.receivedAt || '').toLocaleDateString('pt-BR')})</div>
                    </td>
                    <td className="py-3 px-4 text-right font-extrabold text-slate-900 text-base">
                      {billing.consumptionKwh.toLocaleString('pt-BR', { minimumFractionDigits: 1 })} kWh
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Demonstrativo Financeiro */}
            <div className="py-4 border-t border-slate-200">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">Demonstrativo Financeiro do Consumo</span>
              
              <table className="w-full text-sm border border-slate-200">
                <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold text-xs uppercase">
                  <tr>
                    <th className="py-2.5 px-4 text-left">Item da Fatura</th>
                    <th className="py-2.5 px-4 text-center">Unidade / Alíquota</th>
                    <th className="py-2.5 px-4 text-right">Preço Unitário</th>
                    <th className="py-2.5 px-4 text-right">Valor Total (R$)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono text-slate-700">
                  <tr>
                    <td className="py-3 px-4 text-left font-sans text-slate-800 font-medium">Consumo Ativo de Energia</td>
                    <td className="py-3 px-4 text-center">{billing.consumptionKwh.toLocaleString('pt-BR', { minimumFractionDigits: 1 })} kWh</td>
                    <td className="py-3 px-4 text-right">R$ {parseFloat(tariff).toFixed(4)}</td>
                    <td className="py-3 px-4 text-right text-slate-900">R$ {billing.calculations.activeCost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-left font-sans text-slate-600">Imposto Adicional ICMS</td>
                    <td className="py-2.5 px-4 text-center">{icmsRate}%</td>
                    <td className="py-2.5 px-4 text-right">—</td>
                    <td className="py-2.5 px-4 text-right text-slate-500">R$ {billing.calculations.icmsEst.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-left font-sans text-slate-600">Imposto Adicional PIS/COFINS</td>
                    <td className="py-2.5 px-4 text-center">{pisCofinsRate}%</td>
                    <td className="py-2.5 px-4 text-right">—</td>
                    <td className="py-2.5 px-4 text-right text-slate-500">R$ {billing.calculations.pisCofinsEst.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 text-left font-sans text-slate-600">Contribuição Custeio Iluminação Pública (COSIP)</td>
                    <td className="py-2.5 px-4 text-center">—</td>
                    <td className="py-2.5 px-4 text-right">—</td>
                    <td className="py-2.5 px-4 text-right text-slate-500">R$ {billing.calculations.publicLightingEst.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                  
                  {/* Totalizador */}
                  <tr className="bg-slate-50 font-sans border-t-2 border-slate-300">
                    <td colSpan={3} className="py-4 px-4 text-right text-base font-extrabold text-slate-900">
                      VALOR TOTAL DA FATURA:
                    </td>
                    <td className="py-4 px-4 text-right font-mono font-black text-xl text-blue-900">
                      R$ {billing.calculations.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Código de barras / Pix para fechamento */}
            <div className="mt-8 border-t border-slate-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-6">
              
              {/* Informações Gerais */}
              <div className="text-xs text-slate-400 space-y-1 max-w-md">
                <span className="font-bold text-slate-600 uppercase block tracking-wider">Avisos e Notas Explicativas</span>
                <p>1. Esta fatura é um demonstrativo simulado do consumo ativo de eletricidade registrado pelo medidor IoT KRON no painel de controle.</p>
                <p>2. Os impostos e custos adicionais foram baseados no padrão geral de tarifas ANEEL para 2026.</p>
                <p>3. Mantenha os seus medidores ativos e em sincronia MQTT para garantir a precisão total das faturas mensais.</p>
              </div>

              {/* PIX QRCode Simulado */}
              <div className="flex items-center gap-3 border border-slate-200 rounded-xl p-3 bg-slate-50 shrink-0">
                <div className="w-16 h-16 bg-white border border-slate-300 rounded flex items-center justify-center font-bold text-[10px] text-blue-900 text-center font-mono">
                  [ QR CODE PIX ]
                </div>
                <div className="text-xs">
                  <span className="font-bold text-slate-700 block uppercase tracking-wider">Pague via PIX</span>
                  <span className="text-[10px] text-slate-500 font-mono block mt-1">Chave CNPJ: 12.345.678/0001-90</span>
                  <span className="text-[10px] text-slate-400 block">Ricas Tecnologia Ltda.</span>
                </div>
              </div>
            </div>

            {/* Linha Digitável de Código de Barras Simulado */}
            <div className="mt-6 border-t border-slate-200 pt-4 flex flex-col items-center gap-2">
              <div className="w-full h-8 bg-slate-900 rounded font-mono text-white text-[9px] flex items-center justify-center tracking-[4px] font-bold">
                ||||| | ||||| | ||||| | | ||||| ||||| | | ||||| | |||||||||||||||||||||||||||||||||||| 25072982026
              </div>
              <span className="text-[9px] font-mono text-slate-400 tracking-wider">
                12390.12345 67890.123456 78901.234567 8 98760000{Math.floor(billing.calculations.totalCost).toString().padStart(4, '0')}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
