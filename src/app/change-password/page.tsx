"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2, AlertTriangle } from "lucide-react";
import { signOut } from "next-auth/react";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/user/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao alterar a senha.");
      }

      // Senha alterada com sucesso! Redireciona para o dashboard.
      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zabbix-dark text-white p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-zabbix-primary/20 text-zabbix-primary rounded-full flex items-center justify-center mb-6 border border-zabbix-primary/30">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-wider mb-2">SEGURANÇA DA CONTA</h1>
          <p className="text-slate-400 text-sm">
            Para sua segurança, defina uma nova senha para o seu primeiro acesso.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-zabbix-card/50 backdrop-blur border border-slate-800 p-8 rounded-2xl shadow-xl">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-5 mb-8">
            <div>
              <label className="text-xs text-slate-400 mb-2 block uppercase tracking-wider font-bold">
                Nova Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-zabbix-primary/50 transition-all outline-none"
                placeholder="Mínimo de 8 caracteres"
                required
                minLength={8}
              />
            </div>
            
            <div>
              <label className="text-xs text-slate-400 mb-2 block uppercase tracking-wider font-bold">
                Confirme a Nova Senha
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-zabbix-primary/50 transition-all outline-none"
                placeholder="Digite a senha novamente"
                required
                minLength={8}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-zabbix-primary text-white py-3 rounded-xl font-bold transition-all hover:bg-zabbix-primary/90 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar e Continuar"
              )}
            </button>
            <button
              type="button"
              onClick={async () => {
                await signOut({ redirect: false });
                window.location.href = "/login";
              }}
              disabled={loading}
              className="w-full text-slate-500 hover:text-white text-sm py-2 transition-colors font-medium"
            >
              Sair da conta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
