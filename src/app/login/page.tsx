"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Activity, Lock, User, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Usuário ou senha inválidos");
        setIsLoading(false);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("Ocorreu um erro ao tentar entrar");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zabbix-dark relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-zabbix-primary/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-zabbix-accent/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-md p-8 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center transition-all duration-200 hover:scale-[1.02] mb-3">
            <img 
              src="/logo-ricas-new.png?v=8" 
              alt="Aicon Ricas NOC Brasil"
              style={{ 
                height: '92px',
                maxHeight: '92px',
                imageRendering: '-webkit-optimize-contrast'
              }}
              className="w-auto object-contain filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
            />
          </div>
          <p className="text-slate-400 mt-2 text-sm text-center">Entre com suas credenciais para acessar o painel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-zabbix-card/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider ml-1 mb-1 block">Usuário</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-zabbix-primary/50 transition-all"
                    placeholder="admin"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider ml-1 mb-1 block">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-zabbix-primary/50 transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm py-2 px-3 rounded-lg flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-zabbix-primary hover:bg-zabbix-primary/90 text-white font-semibold py-3 rounded-xl shadow-lg shadow-zabbix-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Entrar no Sistema"
                )}
              </button>
            </div>
          </div>
        </form>

        <p className="text-center mt-8 text-slate-500 text-xs tracking-wide">
          &copy; {new Date().getFullYear()} RICAS TECNOLOGIA. TODOS OS DIREITOS RESERVADOS.
        </p>
      </div>
    </div>
  );
}
