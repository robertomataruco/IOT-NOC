import { NextResponse } from 'next/server';

export async function GET() {
  // Retorna um favicon SVG premium combinando as duas logos perfeitamente lado a lado
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 32" width="64" height="32">
      <!-- Logo Ricas (Triângulo Azul e Preto) -->
      <g transform="translate(2, 2) scale(0.85)">
        <path d="M 12 3 L 2 17 L 7 17 L 12 9 L 17 17 L 22 17 Z" fill="#0091ff" stroke="#0091ff" stroke-width="1.5" stroke-linejoin="round" />
        <path d="M 12 6 L 5 16 L 9 16 L 12 11 L 15 16 L 19 16 Z" fill="none" stroke="#ffffff" stroke-width="1.2" stroke-linejoin="round" />
        <path d="M 2 19 L 22 19" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round" />
      </g>

      <!-- Divisor elegante -->
      <line x1="28" y1="6" x2="28" y2="26" stroke="#334155" stroke-width="1.5" stroke-linecap="round" />

      <!-- Logo Icon (Laranja, Amarelo e Ponto Verde) -->
      <g transform="translate(32, 4) scale(0.9)">
        <!-- Letra i -->
        <rect x="2" y="8" width="3" height="12" fill="#ea580c" rx="0.5" />
        <circle cx="3.5" cy="4" r="1.8" fill="#ea580c" />
        
        <!-- Letra c -->
        <path d="M 13 11 C 10 11, 7 13, 7 16 C 7 19, 10 20, 13 20" fill="none" stroke="#ea580c" stroke-width="3" stroke-linecap="round" />
        
        <!-- Letra o -->
        <circle cx="18" cy="14" r="4.5" fill="none" stroke="#eab308" stroke-width="3" />
        
        <!-- Letra n -->
        <path d="M 24 20 L 24 11 C 24 11, 26 9.5, 28 9.5 C 30 9.5, 30 11, 30 13 L 30 20" fill="none" stroke="#eab308" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        
        <!-- Ponto verde da Icon -->
        <circle cx="32" cy="18" r="2.2" fill="#22c55e" />
      </g>
    </svg>
  `.trim();

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  });
}
