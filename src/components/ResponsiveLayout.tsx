"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export function ResponsiveLayout({
  sidebar,
  header,
  children
}: {
  sidebar: React.ReactNode;
  header: React.ReactNode;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(288);
  const [isResizing, setIsResizing] = useState(false);

  // Carrega a largura salva no localStorage no primeiro render (apenas client-side)
  useEffect(() => {
    const savedWidth = localStorage.getItem("sidebarWidth");
    if (savedWidth) {
      const parsedWidth = parseInt(savedWidth, 10);
      if (!isNaN(parsedWidth) && parsedWidth >= 200 && parsedWidth <= 480) {
        setSidebarWidth(parsedWidth);
      }
    }
  }, []);

  // Salva a largura no localStorage sempre que o usuário terminar de arrastar
  useEffect(() => {
    if (sidebarWidth !== 288) {
      localStorage.setItem("sidebarWidth", sidebarWidth.toString());
    }
  }, [sidebarWidth]);

  const startResizing = (mouseDownEvent: React.MouseEvent) => {
    mouseDownEvent.preventDefault();
    setIsResizing(true);

    const startWidth = sidebarWidth;
    const startX = mouseDownEvent.clientX;

    const doDrag = (mouseMoveEvent: MouseEvent) => {
      const deltaX = mouseMoveEvent.clientX - startX;
      // Define limites saudáveis para a barra lateral (mínimo de 200px e máximo de 480px)
      const newWidth = Math.max(200, Math.min(480, startWidth + deltaX));
      setSidebarWidth(newWidth);
    };

    const stopDrag = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", doDrag);
      document.removeEventListener("mouseup", stopDrag);
    };

    document.addEventListener("mousemove", doDrag);
    document.addEventListener("mouseup", stopDrag);
  };

  return (
    <div className={`flex h-screen w-full overflow-hidden bg-zabbix-dark text-slate-100 ${isResizing ? 'select-none' : ''}`}>
      {/* Sidebar para Desktop */}
      <aside 
        className="hidden md:flex border-r border-slate-800 bg-zabbix-card/40 backdrop-blur-xl flex-shrink-0 flex-col relative group"
        style={{ width: `${sidebarWidth}px` }}
      >
        {sidebar}
        {/* Resizer Handle */}
        <div
          onMouseDown={startResizing}
          className={`absolute top-0 right-[-3px] w-[6px] h-full cursor-col-resize hover:bg-zabbix-primary/50 bg-transparent transition-all z-50 select-none ${isResizing ? 'bg-zabbix-primary/80 w-[4px]' : ''}`}
        />
      </aside>

      {/* Overlay/Sidebar Drawer para Mobile */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop escuro com desfoque */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Sidebar Drawer */}
          <aside className="relative flex w-72 max-w-[80vw] h-full flex-col border-r border-slate-800 bg-zabbix-dark/95 backdrop-blur-xl shadow-2xl animate-in slide-in-from-left duration-200">
            {/* Botão de Fechar no Drawer */}
            <div className="absolute top-4 right-4 z-50">
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/50 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Fechar a barra lateral ao clicar em qualquer item de navegação */}
            <div onClick={() => setIsOpen(false)} className="h-full flex flex-col overflow-hidden">
              {sidebar}
            </div>
          </aside>
        </div>
      )}

      {/* Área de Conteúdo Principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Cabeçalho Responsivo */}
        <header className="relative z-30 h-16 border-b border-slate-800 bg-zabbix-dark/50 backdrop-blur flex items-center px-4 md:px-8 justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {/* Botão Hamburger para Mobile */}
            <button
              onClick={() => setIsOpen(true)}
              className="flex md:hidden p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Título e Botão Voltar */}
            {header}
          </div>
          
          {/* Status do Sistema */}
          <div className="flex items-center gap-2 shrink-0 pl-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zabbix-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-zabbix-accent"></span>
            </span>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">Online</span>
          </div>
        </header>

        {/* Corpo principal da página */}
        <main className="flex-1 overflow-auto p-4 md:p-8 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
